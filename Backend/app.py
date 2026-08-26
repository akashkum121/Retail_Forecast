
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Load product list
PRODUCTS_FILE = r'C:\Users\akash\Downloads\user_pasted_clipboard_long_content_as_file_BEACH HUT MIRROR DE.txt'
products_list = []
if os.path.exists(PRODUCTS_FILE):
    with open(PRODUCTS_FILE, 'r', encoding='utf-8', errors='ignore') as f:
        products_list = [line.strip() for line in f if line.strip()]

# Load or create model
model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')

# If model doesn't exist, create a dummy model for demonstration
if not os.path.exists(model_path):
    from sklearn.ensemble import RandomForestRegressor
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    # Dummy training data
    X_train = np.random.rand(100, 5) * 100
    y_train = np.random.rand(100) * 50 + 10
    model.fit(X_train, y_train)
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    print("Created dummy model.pkl")
else:
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    print("Loaded existing model.pkl")

# Mock KPI data
kpis = {
    "total_revenue": 8911407.9,
    "total_orders": 18532,
    "top_product": "PAPER CRAFT , LITTLE BIRDIE",
    "top_city": "United Kingdom",
    "model_r2_score": 0.9047,
    "highest_sale_value": 168469.6
}

@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify({"success": True, "products": products_list})

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # Map new frontend fields to the 5 numeric features the dummy model expects
        unit_price = float(data.get('unit_price', 0))
        customer_id = data.get('customer_id', '0')
        customer_id = int(customer_id) if str(customer_id).isdigit() else 0

        features = [
            float(len(str(data.get('product', ''))) % 7 + 1), # day_of_week
            float(len(str(data.get('country', ''))) % 12 + 1), # month
            unit_price, # price
            float(customer_id % 2), # promotion
            float(100) # inventory_level
        ]

        # Make prediction
        X = np.array([features])
        prediction = model.predict(X)[0]

        # Ensure positive prediction
        prediction = int(max(0, round(prediction)))

        # 1. Price Sensitivity (50%, 75%, 100%, 125%, 150% of unit_price)
        price_multipliers = [0.5, 0.75, 1.0, 1.25, 1.5]
        price_batch = []
        for m in price_multipliers:
            f = features.copy()
            f[2] = unit_price * m
            price_batch.append(f)
        price_preds = model.predict(np.array(price_batch))
        price_scenarios = [
            {
                "label": f"{int(m * 100)}%",
                "price": round(unit_price * m, 2),
                "predicted_quantity": int(max(0, round(p)))
            } for m, p in zip(price_multipliers, price_preds)
        ]

        # 2. Day of Week (1-7)
        day_batch = []
        for d in range(1, 8):
            f = features.copy()
            f[0] = float(d)
            day_batch.append(f)
        day_preds = model.predict(np.array(day_batch))
        days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        day_scenarios = [
            {
                "day": days[d - 1],
                "predicted_quantity": int(max(0, round(p)))
            } for d, p in zip(range(1, 8), day_preds)
        ]

        # 3. Monthly Seasonality (1-12)
        month_batch = []
        for m in range(1, 13):
            f = features.copy()
            f[1] = float(m)
            month_batch.append(f)
        month_preds = model.predict(np.array(month_batch))
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        month_scenarios = [
            {
                "month": months[m - 1],
                "predicted_quantity": int(max(0, round(p)))
            } for m, p in zip(range(1, 13), month_preds)
        ]

        # 4. Promotion Impact
        promo_batch = []
        for p_val in [0.0, 1.0]:
            f = features.copy()
            f[3] = p_val
            promo_batch.append(f)
        promo_preds = model.predict(np.array(promo_batch))
        promo_scenarios = {
            "no_promo": int(max(0, round(promo_preds[0]))),
            "promo": int(max(0, round(promo_preds[1])))
        }

        return jsonify({
            "success": True,
            "predicted_quantity": prediction,
            "timestamp": datetime.now().isoformat(),
            "features_used": features,
            "scenarios": {
                "price_sensitivity": price_scenarios,
                "day_of_week": day_scenarios,
                "monthly_seasonality": month_scenarios,
                "promotion_impact": promo_scenarios
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/kpis', methods=['GET'])
def get_kpis():
    # Add some random variation to make it feel alive
    current_kpis = kpis.copy()
    current_kpis["total_revenue"] = round(kpis["total_revenue"] + random.random() * 500, 2)
    current_kpis["total_orders"] = int(kpis["total_orders"] + random.random() * 10)
    return jsonify({"success": True, "data": current_kpis})

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "model_loaded": True})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
