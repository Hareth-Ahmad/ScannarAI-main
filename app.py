import streamlit as st
from PIL import Image
import torch
from transformers import ViTImageProcessor, ViTForImageClassification
import numpy as np
import sys
import matplotlib.pyplot as plt

# -----------------------------------------------------------------------------
# 🔹 استيراد Noiseprint من المسار الصحيح داخل مشروعك
# -----------------------------------------------------------------------------
sys.path.insert(0, "C:/Users/bedew/ai_face_scanner/noiseprint")  # صحّحنا المسار

try:
    import noiseprint
    st.write("📂 Noiseprint loaded from:", noiseprint.__file__)
    from noiseprint.noiseprint import genNoiseprint
    noiseprint_ok = True
except Exception as e:
    st.error(f"⚠️ لم يتم تحميل Noiseprint بشكل صحيح: {e}")
    noiseprint_ok = False

# -----------------------------------------------------------------------------
# إعداد الصفحة
# -----------------------------------------------------------------------------
st.set_page_config(page_title="AI Vision Scanner", page_icon="🕵️", layout="wide")

def local_css():
    st.markdown("""
    <style>
    body {
        background: linear-gradient(135deg, #1f1c2c, #928DAB);
        color: white;
    }
    .main-title {
        text-align: center;
        font-size: 42px;
        color: #ffffff;
        font-weight: bold;
        margin-bottom: 20px;
    }
    .card {
        background: rgba(255,255,255,0.15);
        padding: 25px;
        border-radius: 15px;
        box-shadow: 0px 8px 25px rgba(0,0,0,0.3);
        backdrop-filter: blur(12px);
    }
    .stButton>button {
        background-color: #4a69bd;
        color: white;
        border-radius: 10px;
        padding: 10px 20px;
        font-weight: bold;
        border: none;
    }
    .stButton>button:hover {
        background-color: #1e3799;
    }
    </style>
    """, unsafe_allow_html=True)

local_css()

# -----------------------------------------------------------------------------
# تحميل الموديلات
# -----------------------------------------------------------------------------
@st.cache_resource
def load_vit():
    processor = ViTImageProcessor.from_pretrained("google/vit-base-patch16-224")
    model = ViTForImageClassification.from_pretrained("google/vit-base-patch16-224")
    return processor, model

processor_cls, model_cls = load_vit()

@st.cache_resource
def load_deepfake_model():
    model_name = "prithivMLmods/Deep-Fake-Detector-v2-Model"
    processor = ViTImageProcessor.from_pretrained(model_name)
    model = ViTForImageClassification.from_pretrained(model_name)
    return processor, model

processor_df, model_df = load_deepfake_model()

# -----------------------------------------------------------------------------
# صفحة تسجيل الدخول
# -----------------------------------------------------------------------------
def login_page():
    st.markdown("<h1 class='main-title'>🔐 Face Scanner Login</h1>", unsafe_allow_html=True)
    with st.container():
        with st.form("login_form", clear_on_submit=False):
            st.markdown("<div class='card'>", unsafe_allow_html=True)
            username = st.text_input("👤 Username")
            password = st.text_input("🔑 Password", type="password")
            submitted = st.form_submit_button("Login")
            st.markdown("</div>", unsafe_allow_html=True)

            if submitted:
                if username.strip() == "admin" and password.strip() == "1234":
                    st.session_state["logged_in"] = True
                    st.success("✅ Login successful!")
                else:
                    st.error("❌ Invalid username or password")

# -----------------------------------------------------------------------------
# صفحة Image Classification
# -----------------------------------------------------------------------------
def image_classification_page():
    st.markdown("<h1 class='main-title'>🖼️ Image Classification</h1>", unsafe_allow_html=True)

    uploaded_file = st.file_uploader("Upload an image", type=["jpg", "jpeg", "png"])
    if uploaded_file:
        image = Image.open(uploaded_file).convert("RGB")
        st.image(image, caption="Uploaded Image", use_column_width=True)
        st.write("🔍 Analyzing with ViT model...")

        inputs = processor_cls(images=image, return_tensors="pt")
        with torch.no_grad():
            outputs = model_cls(**inputs)
            pred = outputs.logits.argmax(-1).item()
        label = model_cls.config.id2label[pred]

        st.success(f"✅ Prediction: {label}")

# -----------------------------------------------------------------------------
# صفحة DeepFake Detection
# -----------------------------------------------------------------------------
def predict_deepfake(img):
    inputs = processor_df(images=img, return_tensors="pt")
    with torch.no_grad():
        outputs = model_df(**inputs)
        logits = outputs.logits
        predicted = torch.argmax(logits, dim=1).item()
    label = model_df.config.id2label[predicted]
    return label

def deepfake_detection_page():
    st.markdown("<h1 class='main-title'>🕵️ DeepFake Detection (HF)</h1>", unsafe_allow_html=True)

    uploaded = st.file_uploader("Upload face image for deepfake detection", type=["jpg","jpeg","png"])
    if uploaded:
        img = Image.open(uploaded).convert("RGB")
        st.image(img, caption="Uploaded Face", use_column_width=True)
        result = predict_deepfake(img)

        if "Deepfake" in result or result.lower().startswith("fake"):
            st.error(f"⚠️ Detected: {result}")
        else:
            st.success(f"✅ Detected: {result}")

# -----------------------------------------------------------------------------
# صفحة Noiseprint Forgery Detection
# -----------------------------------------------------------------------------
def forgery_detection_page():
    st.markdown("<h1 class='main-title'>🖼️ Image Forgery Detection (Noiseprint)</h1>", unsafe_allow_html=True)

    if not noiseprint_ok:
        st.error("❌ مكتبة Noiseprint لم تُحمّل بشكل صحيح، لا يمكن استخدام هذه الميزة.")
        return

    uploaded = st.file_uploader("Upload any image", type=["jpg","jpeg","png"])
    if uploaded:
        img = Image.open(uploaded).convert("L")  # grayscale
        img_np = np.array(img)
        img_np = img_np[np.newaxis, :, :, np.newaxis].astype(np.float32)

        try:
            noise_map = genNoiseprint(img_np)

            col1, col2 = st.columns(2)

            with col1:
                st.image(img, caption="Original Image", use_column_width=True, channels="GRAY")

            with col2:
                fig, ax = plt.subplots()
                cax = ax.imshow(noise_map, cmap="jet")
                ax.axis("off")
                fig.colorbar(cax)
                st.pyplot(fig)
                st.caption("Noiseprint Heatmap")

            st.info("✅ تحقق من الخريطة: المناطق غير الطبيعية (ألوان حادة) قد تشير إلى تعديل أو تزوير.")
        except Exception as e:
            st.error(f"❌ خطأ أثناء تحليل Noiseprint: {e}")

# -----------------------------------------------------------------------------
# الصفحة الرئيسية
# -----------------------------------------------------------------------------
def main_page():
    st.sidebar.title("📌 Navigation")
    page = st.sidebar.radio("Choose a page:", [
        "Image Classification",
        "DeepFake Detection",
        "Forgery Detection (Noiseprint)"
    ])

    if page == "Image Classification":
        image_classification_page()
    elif page == "DeepFake Detection":
        deepfake_detection_page()
    elif page == "Forgery Detection (Noiseprint)":
        forgery_detection_page()

# -----------------------------------------------------------------------------
# إدارة الجلسة
# -----------------------------------------------------------------------------
if "logged_in" not in st.session_state:
    st.session_state["logged_in"] = False

if not st.session_state["logged_in"]:
    login_page()
else:
    main_page()
