<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1c3D1gf5qg_UX7mhnnR3giAxXXJeqztBg

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Streamlit (Public URL via Streamlit Community Cloud)

This repo also includes a Streamlit app entrypoint for a stable public demo URL.

- Entrypoint: `streamlit_app.py`
- Dependencies: `requirements.txt`
- Bundled demo sample: `samples/`

### Run locally (Streamlit)

1. Install Python dependencies:
   `pip install -r requirements.txt`
2. (Optional) Create a local secrets file (do not commit):
   - Create `.streamlit/secrets.toml` (see `.streamlit/secrets.toml.example`)
3. Run:
   `streamlit run streamlit_app.py`

### Deploy (Streamlit Community Cloud)

1. Push this repo to GitHub
2. In Streamlit Community Cloud: **Create app** → select the repo/branch → set **Main file** to `streamlit_app.py`
3. In **Secrets**, add:
   `GEMINI_API_KEY = "..."`
