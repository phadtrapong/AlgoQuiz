import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "quiz-data.json"
MANIFEST_PATH = ROOT / "blind75-manifest.json"


def slugify(text: str) -> str:
    return re.sub(r"(^-|-$)", "", re.sub(r"[^a-z0-9]+", "-", text.lower()))


def with_schema(meta: dict, q: dict) -> dict:
    qid = meta["slug"]
    choices = []
    for i, c in enumerate(q.get("choices", []), start=1):
        explanation = str(c.get("explanation", "")).strip()
        if not explanation:
            explanation = (
                "This is the intended interview-grade solution."
                if c.get("correct")
                else "This option is incorrect or suboptimal for this problem."
            )
        choices.append(
            {
                "id": c.get("id") or f"{qid}-c{i}",
                "text": c.get("text") or "# TODO",
                "correct": bool(c.get("correct")),
                "explanation": explanation,
                "rationaleTags": c.get("rationaleTags")
                if isinstance(c.get("rationaleTags"), list)
                else (["correct"] if c.get("correct") else ["incorrect"]),
            }
        )

    if sum(1 for c in choices if c["correct"]) != 1:
        raise ValueError(f"{q.get('problemTitle')} must have exactly one correct choice.")

    return {
        "id": q.get("id") or qid,
        "problemTitle": q.get("problemTitle") or meta["title"],
        "problemSlug": q.get("problemSlug") or meta["slug"],
        "topic": q.get("topic") or meta["topic"],
        "difficulty": q.get("difficulty") or meta["difficulty"],
        "problemStatement": q.get("problemStatement") or "Problem statement unavailable.",
        "codeSkeleton": q.get("codeSkeleton") or "class Solution(object):\n    pass",
        "choices": choices,
    }


def generated_question(meta: dict) -> dict:
    qid = meta["slug"]
    method = slugify(meta["title"].split(". ", 1)[1]).replace("-", "_")
    return {
        "id": qid,
        "problemTitle": meta["title"],
        "problemSlug": meta["slug"],
        "topic": meta["topic"],
        "difficulty": meta["difficulty"],
        "problemStatement": (
            f"Solve {meta['title']} using an interview-appropriate approach. "
            "Choose the best implementation snippet."
        ),
        "codeSkeleton": (
            "class Solution(object):\n"
            f"    def {method}(self, *args):\n"
            "        \"\"\"\n"
            "        :rtype: object\n"
            "        \"\"\"\n"
            "        # <MISSING CODE BLOCK>"
        ),
        "choices": [
            {
                "id": f"{qid}-c1",
                "text": (
                    "# Recommended pattern\n"
                    "# Use the canonical algorithm for this problem category\n"
                    "# and return the required result.\n"
                    "pass"
                ),
                "correct": True,
                "explanation": "Represents the intended optimal interview approach for this problem.",
                "rationaleTags": ["optimal", "pattern"],
            },
            {
                "id": f"{qid}-c2",
                "text": (
                    "# Brute-force placeholder\n"
                    "# Often too slow for worst-case constraints.\n"
                    "pass"
                ),
                "correct": False,
                "explanation": "This approach is typically too slow under stated constraints.",
                "rationaleTags": ["suboptimal"],
            },
            {
                "id": f"{qid}-c3",
                "text": (
                    "# Edge-case bug\n"
                    "# Misses empty input / bounds checks.\n"
                    "pass"
                ),
                "correct": False,
                "explanation": "Fails common edge cases and may produce incorrect output.",
                "rationaleTags": ["edge-case"],
            },
            {
                "id": f"{qid}-c4",
                "text": (
                    "# Incorrect logic\n"
                    "# Returns constant or unrelated value.\n"
                    "return None"
                ),
                "correct": False,
                "explanation": "Does not solve the stated problem.",
                "rationaleTags": ["incorrect-logic"],
            },
        ],
    }


def main() -> None:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    if len(manifest) != 75:
        raise ValueError(f"Manifest must contain 75 entries, got {len(manifest)}.")

    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    by_title = {q.get("problemTitle"): q for q in data}
    manifest_titles = {m["title"] for m in manifest}

    out = []
    for meta in manifest:
        title = meta["title"]
        if title in by_title:
            out.append(with_schema(meta, by_title[title]))
        else:
            out.append(generated_question(meta))

    extras = [q for q in data if q.get("problemTitle") not in manifest_titles]
    for idx, q in enumerate(extras, start=1):
        extra_meta = {
            "slug": f"extra-{idx}-{slugify(q.get('problemTitle', 'question'))}",
            "title": q.get("problemTitle", f"Extra {idx}"),
            "topic": q.get("topic", "Extra"),
            "difficulty": q.get("difficulty", "Medium"),
        }
        out.append(with_schema(extra_meta, q))

    DATA_PATH.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print(f"Wrote {len(out)} questions ({len(manifest)} manifest + {len(extras)} extra).")


if __name__ == "__main__":
    main()
