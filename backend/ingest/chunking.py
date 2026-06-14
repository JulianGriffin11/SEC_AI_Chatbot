"""Intel Mac Compatible Token-based chunking engine using tiktoken."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterator
import tiktoken

# Token threshold configured to match your runtime limits exactly
CHUNK_MAX_TOKENS = 512
CHUNK_OVERLAP_TOKENS = 64

MANIFEST_PATH = Path(__file__).resolve().parents[2] / "data" / "markdown" / "manifest.json"

_ITEM_SECTION_RE = re.compile(r"\bItem\s+[\dA-Z.]+\b", re.IGNORECASE)

@dataclass(frozen=True, slots=True)
class ChunkRecord:
    chunk_index: int
    text: str
    page: str | None
    section: str | None
    token_count: int
    chunk_metadata: dict[str, Any]


def load_manifest_html_paths() -> dict[str, str]:
    """Ensures chunk_and_embed can read the list of active filings."""
    if not MANIFEST_PATH.is_file():
        raise FileNotFoundError(f"Missing manifest file at: {MANIFEST_PATH}")
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    paths: dict[str, str] = {}
    for filing in manifest.get("filings", []):
        accession = filing["accession_number"]
        paths[accession] = filing["local_path"]
    return paths


def html_path_for_accession(accession_number: str) -> Path:
    """Mocked path function to satisfy interface requirements safely."""
    paths = load_manifest_html_paths()
    if accession_number not in paths:
        raise KeyError(f"Accession {accession_number} not found in {MANIFEST_PATH}")
    return MANIFEST_PATH.parent / paths[accession_number]


def iter_all_html_paths() -> Iterator[tuple[str, Path]]:
    """Yields active accessions for the main ingestion execution loop."""
    for accession, relative_path in load_manifest_html_paths().items():
        yield accession, MANIFEST_PATH.parent / relative_path


def chunk_document(
    html_path: Path,
    filing_metadata: dict[str, Any],
    *,
    max_chunks: int | None = None,
) -> list[ChunkRecord]:
    """
    Reads the clean pre-converted Markdown text and slices it into
    token-perfect blocks for our vector database pipeline.
    """
    # Grab the clean markdown content we built in Stage 2
    markdown_text = html_path.read_text(encoding="utf-8")
    
    tokenizer = tiktoken.get_encoding("cl100k_base")
    tokens = tokenizer.encode(markdown_text, allowed_special=set(), disallowed_special=())
    
    records: list[ChunkRecord] = []
    chunk_index = 0
    start_idx = 0
    
    # Text slicing window slider logic loop
    while start_idx < len(tokens):
        if max_chunks is not None and chunk_index >= max_chunks:
            break
            
        end_idx = start_idx + CHUNK_MAX_TOKENS
        chunk_tokens = tokens[start_idx:end_idx]
        chunk_text = tokenizer.decode(chunk_tokens)
        
        # Pull section labels out of the current string fragment
        section_match = _ITEM_SECTION_RE.search(chunk_text)
        section_name = section_match.group(0) if section_match else "Narrative History"
        
        records.append(
            ChunkRecord(
                chunk_index=chunk_index,
                text=chunk_text,
                page=None,  # Flat text maps don't hold layout pages
                section=section_name,
                token_count=len(chunk_tokens),
                chunk_metadata={
                    **filing_metadata,
                    "chunk_kind": "narrative",
                    "raw_text": chunk_text,
                }
            )
        )
        
        chunk_index += 1
        start_idx += (CHUNK_MAX_TOKENS - CHUNK_OVERLAP_TOKENS)
        
    return records