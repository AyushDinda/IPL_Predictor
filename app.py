import streamlit as st
import pandas as pd
import json
import plotly.express as px

# 1. Advanced Page Config
st.set_page_config(
    layout="wide", 
    page_title="IPL AI Elite Analytics", 
    page_icon="🏏",
    initial_sidebar_state="collapsed"
)

# -------------------------
# TEAM LOGOS & MAPPING FIX
# -------------------------
# Mapping abbreviations to full names to ensure CSS and Logic match
team_map = {
    "CSK": "Chennai Super Kings",
    "MI": "Mumbai Indians",
    "RCB": "Royal Challengers Bengaluru",
    "KKR": "Kolkata Knight Riders",
    "DC": "Delhi Capitals",
    "PBKS": "Punjab Kings",
    "RR": "Rajasthan Royals",
    "SRH": "Sunrisers Hyderabad",
    "GT": "Gujarat Titans",
    "LSG": "Lucknow Super Giants"
}


# Winning years for current IPL teams
trophy_data = {
    "Chennai Super Kings": ["2010", "2011", "2018", "2021", "2023"],
    "Mumbai Indians": ["2013", "2015", "2017", "2019", "2020"],
    "Kolkata Knight Riders": ["2012", "2014", "2024"],
    "Rajasthan Royals": ["2008"],
    "Sunrisers Hyderabad": ["2016"],
    "Gujarat Titans": ["2022"],
    "Royal Challengers Bengaluru": ["2025"],
    "Delhi Capitals": [],
    "Punjab Kings": [],
    "Lucknow Super Giants": []
}

# -------------------------
# ACCESSIBLE PREMIUM CSS
# -------------------------
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
    
    :root {
        --primary-accent: #6366f1;
        --secondary-accent: #f43f5e;
        --glass-bg: rgba(255, 255, 255, 0.03);
        --text-main: #f8fafc;
        --glow: rgba(99, 102, 241, 0.2);
    }

    html, body, [class*="st-"] {
        font-family: 'Outfit', sans-serif;
        color: var(--text-main);
    }

    .premium-card {
        background: var(--glass-bg);
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(16px);
        padding: 24px;
        border-radius: 20px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease-in-out;
        height: 100%;
    }
    
    .premium-card:hover {
        border-color: var(--primary-accent);
        transform: translateY(-5px);
        box-shadow: 0 10px 40px var(--glow);
        background: rgba(255, 255, 255, 0.07);
    }

    .hero-container {
        background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
        padding: 3.5rem;
        border-radius: 28px;
        border-right: 4px solid var(--primary-accent);
        margin-bottom: 2.5rem;
        position: relative;
        overflow: hidden;
    }

    .badge {
        background: linear-gradient(90deg, var(--secondary-accent), #fb7185);
        padding: 6px 16px;
        border-radius: 99px;
        font-size: 11px;
        letter-spacing: 1px;
        font-weight: 800;
        text-transform: uppercase;
        color: white;
    }
    
    img { vertical-align: middle; margin-bottom: 4px; }
    </style>
""", unsafe_allow_html=True)

# -------------------------
# DATA LOADING & CLEANING
# -------------------------
import requests

try:
    response = requests.get("https://ipl-predictor-te7x.onrender.com/probabilities", timeout=10)
    response.raise_for_status()  # raises error if API fails
    raw_data = response.json()

except Exception:
    # fallback data if API fails
    raw_data = {
        "Chennai Super Kings": 1.5,
        "Delhi Capitals": 3.12,
        "Gujarat Titans": 11.12,
        "Kolkata Knight Riders": 1.25,
        "Lucknow Super Giants": 3.12,
        "Mumbai Indians": 1.62,
        "Punjab Kings": 21.75,
        "Rajasthan Royals": 6.0,
        "Royal Challengers Bengaluru": 47.12,
        "Sunrisers Hyderabad": 3.38
    }
# Standardize names to full names
clean_data = {team_map.get(k, k): v for k, v in raw_data.items()}

SIMS = sum(clean_data.values())
data_pct = {k: round(v/SIMS*100, 1) for k, v in clean_data.items()}
df = pd.DataFrame(list(data_pct.items()), columns=["Team", "Probability"]).sort_values("Probability", ascending=False)

# -------------------------
# HERO SECTION
# -------------------------
top_team = df.iloc[0]
st.markdown(f"""
<div class="hero-container">
    <span class="badge">Engine: Monte Carlo v4.2</span>
    <h1 style='font-weight: 800; font-size: 3.5rem; margin: 15px 0; letter-spacing: -1px; color: white;'>
        {top_team['Team']} <span style='color: var(--primary-accent);'>Dominance Detected.</span>
    </h1>
    <p style='font-size: 1.3rem; opacity: 0.8; max-width: 700px; color: #cbd5e1;'>
        Our AI models have processed the latest pitch conditions and player forms. 
        <strong>{top_team['Team']}</strong> leads the pack with a <strong>{top_team['Probability']}%</strong> win probability.
    </p>
</div>
""", unsafe_allow_html=True)

# -------------------------
# MAIN ANALYTICS TABS
# -------------------------
tab1, tab2 = st.tabs(["📊 Win Matrix", "📈 Trends & Factors"])

with tab1:
    c1, c2 = st.columns([1.4, 1])

    with c1:
        st.markdown("### 🏆 Prediction Landscape")
        fig = px.bar(df, x='Probability', y='Team', orientation='h',
                     color='Probability', color_continuous_scale='Plasma',
                     template='plotly_dark', text='Probability')
        fig.update_layout(yaxis={'categoryorder':'total ascending'}, margin=dict(l=0, r=0, t=20, b=0),
                          paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)',
                          xaxis=dict(showgrid=False, showticklabels=False),
                          yaxis_title=None, xaxis_title=None, coloraxis_showscale=False)
        st.plotly_chart(fig, use_container_width=True, config={'displayModeBar': False})

    with c2:
        st.markdown("### 🏟️ Tournament Bracket")
        top4 = df["Team"].head(4).tolist()
        st.markdown(f"""
        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 15px; border: 1px dashed rgba(255,255,255,0.2);">
            <div style="margin-bottom: 20px;">
                <small style="color: var(--primary-accent); font-weight: 700;">QUALIFIER 1</small><br>
                <span style="font-size: 1.2rem;">
                    <span style="opacity:0.3"> vs </span> 
                </span>
            </div>
            <div>
                <small style="color: var(--secondary-accent); font-weight: 700;">ELIMINATOR</small><br>
                <span style="font-size: 1.2rem;">
                    <span style="opacity:0.3"> vs </span> 
            </div>
        </div>
        """, unsafe_allow_html=True)

# -------------------------
# SQUAD ANALYTICS GRID
# -------------------------
st.markdown("<br><h3 style='margin-bottom:20px;'>⚡ Power Rankings</h3>", unsafe_allow_html=True)
cols = st.columns(4)

for i, (idx, row) in enumerate(df.iterrows()):
    with cols[i % 4]:
        card_border = "var(--primary-accent)" if i == 0 else "rgba(255,255,255,0.1)"
        st.markdown(f"""
        <div class="premium-card" style="border-top: 4px solid {card_border}; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: var(--primary-accent); font-weight: 800; font-size: 0.8rem;">RANK {i+1}</span>
            </div>
            <div style="font-size: 1.5rem; font-weight: 800; margin: 12px 0; letter-spacing: -0.5px; line-height: 1.1;">{row['Team']}</div>
            <div style="font-size: 0.85rem; opacity: 0.6;">Win Potential</div>
            <div style="font-size: 2.2rem; font-weight: 800;">{row['Probability']}%</div>
            <div style="margin-top: 15px; height: 4px; width: 100%; background: rgba(255,255,255,0.1); border-radius: 2px;">
                <div style="height: 100%; width: {row['Probability']}%; background: var(--primary-accent); border-radius: 2px;"></div>
            </div>
        </div>
        """, unsafe_allow_html=True)

        team_name = row['Team']
        trophies = trophy_data.get(team_name, [])
        button_label = f"🏆 {len(trophies)} Trophies" if trophies else "No Titles Yet"
        
        if st.button(button_label, key=f"btn_{team_name}", use_container_width=True):
            if trophies:
                st.success(f"Champions: {', '.join(trophies)}")
            else:
                st.info("Still hunting for the first title!")

st.divider()
st.caption("Developed for high-stakes sports analytics. © 2026 AI Elite Systems.")