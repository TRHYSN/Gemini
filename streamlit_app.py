import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import streamlit as st


@dataclass(frozen=True)
class DemoSample:
    label: str
    narrative_path: Path
    expected_json_path: Path


ROOT = Path(__file__).parent
SAMPLES_DIR = ROOT / "samples"

DEMO_SAMPLES: dict[str, DemoSample] = {
    "Break-in Narrative": DemoSample(
        label="Break-in Narrative",
        narrative_path=SAMPLES_DIR / "break_in_narrative.txt",
        expected_json_path=SAMPLES_DIR / "break_in_expected.json",
    )
}


def _read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def _load_json(path: Path) -> dict[str, Any]:
    return json.loads(_read_text(path))


def _extract_json_object(text: str) -> dict[str, Any]:
    fenced = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, flags=re.DOTALL | re.IGNORECASE)
    if fenced:
        return json.loads(fenced.group(1))

    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        return json.loads(text[start : end + 1])

    raise ValueError("Model output did not contain a JSON object.")


def _render_result(result: dict[str, Any]) -> None:
    st.subheader("1) Anomaly curve")
    curve = result.get("anomaly_curve", [])
    if isinstance(curve, list) and curve:
        try:
            import pandas as pd  # optional but recommended

            df = pd.DataFrame(curve)
            if {"t", "score"}.issubset(df.columns):
                df = df.set_index("t")
                st.line_chart(df["score"])
            st.dataframe(df, use_container_width=True)
        except Exception:
            st.write(curve)
    else:
        st.info("No anomaly curve provided.")

    st.subheader("2) Event timeline")
    timeline = result.get("event_timeline", [])
    if isinstance(timeline, list) and timeline:
        st.dataframe(timeline, use_container_width=True)
    else:
        st.info("No event timeline provided.")

    st.subheader("3) Draft Report")
    st.write(result.get("draft_report", ""))

    st.subheader("4) Consistency Check")
    st.write(result.get("consistency_check", ""))

    st.subheader("5) Final Report")
    st.write(result.get("final_report", ""))


def _call_gemini(api_key: str, narrative: str, model: str) -> dict[str, Any]:
    from google import genai

    client = genai.Client(api_key=api_key)
    prompt = f"""
You are a forensic analyst. Given the narrative below, produce ONE JSON object (no markdown) with exactly these keys:
- anomaly_curve: array of objects with keys t (string) and score (number 0..1)
- event_timeline: array of objects with keys t (string), event (string), confidence (number 0..1)
- draft_report: string
- consistency_check: string
- final_report: string

Keep it concise but coherent. Do not include any keys beyond the five listed.

NARRATIVE:
{narrative}
""".strip()

    resp = client.models.generate_content(model=model, contents=prompt)
    text = getattr(resp, "text", None) or ""
    return _extract_json_object(text)


st.set_page_config(page_title="Gemini Hack Demo (Streamlit)", layout="wide")
st.title("Gemini Hack Demo (Streamlit)")

left, right = st.columns([1, 1], gap="large")

with left:
    sample_name = st.selectbox("Choose demo sample", list(DEMO_SAMPLES.keys()), index=0)
    sample = DEMO_SAMPLES[sample_name]
    narrative = _read_text(sample.narrative_path)
    st.caption("Tip: Demo mode works without an API key (recommended for judging reliability).")
    narrative = st.text_area("Input narrative", narrative, height=220)

with right:
    st.subheader("Run settings")
    use_live = st.toggle("Use live Gemini (requires API key)", value=False)
    model = st.selectbox(
        "Model",
        ["gemini-2.0-flash", "gemini-2.0-pro", "gemini-1.5-flash", "gemini-1.5-pro"],
        index=0,
    )

    api_key = (
        st.secrets.get("GEMINI_API_KEY")
        or st.secrets.get("GOOGLE_API_KEY")
        or st.secrets.get("api_key")
        or ""
    )
    if use_live and not api_key:
        st.warning("No API key found in Streamlit secrets. Set `GEMINI_API_KEY` (recommended).")

analyze = st.button("Analyze", type="primary", use_container_width=True)

if analyze:
    try:
        if use_live and api_key:
            with st.spinner("Calling Gemini..."):
                result = _call_gemini(api_key=api_key, narrative=narrative, model=model)
        else:
            result = _load_json(sample.expected_json_path)

        _render_result(result)
        st.download_button(
            "Download result JSON",
            data=json.dumps(result, ensure_ascii=False, indent=2),
            file_name="analysis_result.json",
            mime="application/json",
            use_container_width=True,
        )
    except Exception as e:
        st.error("Analyze failed.")
        st.exception(e)
