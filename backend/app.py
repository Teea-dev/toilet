# from urllib import request
import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import math


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ui_toilets.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)


class Toilet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    rating = db.Column(db.Float, nullable=False)
    num_ratings = db.Column(db.Integer, nullable=False)
    is_male = db.Column(db.Boolean, nullable = False)
    is_female = db.Column(db.Boolean, nullable = False)
    is_accessible = db.Column(db.Boolean, nullable = False)
    is_open = db.Column(db.Boolean, nullable = False)
    cleaniness_rating = db.Column(db.Float, nullable = False)
    description = db.Column(db.Text)
    
    
def haversine(lat1, lon1, lat2, lon2):
    
    R = 6371  # Radius of the Earth in kilometers
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

@app.route('/api/add_toilet', methods=['POST'])

def add_toilet():
    data = request.json        
    
    required_fields = ['name', 'location', 'is_male', 'is_female', 'is_accessible']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400

    new_toilet = Toilet(
        name=data['name'],
        latitude=data['location']['latitude'],
        longitude=data['location']['longitude'],
        is_male=data['is_male'],
        is_female=data['is_female'],
        is_accessible=data['is_accessible'],
        is_open=data.get('is_open', True),
        cleaniness_rating=data.get('cleaniness_rating', 0.0),
        description=data.get('description', ''),
        rating=0.0,
        num_ratings=0
    )

    db.session.add(new_toilet)
    db.session.commit()

    return jsonify({'message': 'Toilet added successfully', 'toilet_id': new_toilet.id}), 201
            
@app.route('/api/toilets', methods=['GET'])
def get_toilets():
    lat = request.args.get('latitude', type=float) 
    lon = request.args.get('longitude', type=float)
    
    # Filter options
    is_male = request.args.get('is_male', type=bool)
    is_female = request.args.get('is_female', type=bool)
    is_accessible = request.args.get('is_accessible', type=bool)
    is_open = request.args.get('is_open', type=bool)
    
    # Base query
    query = Toilet.query     
    
    # Apply filters
    if is_male is not None:
        query = query.filter_by(is_male=is_male)
    if is_female is not None:    
        query = query.filter_by(is_female=is_female)
    if is_accessible is not None:
        query = query.filter_by(is_accessible=is_accessible)
    if is_open is not None:
        query = query.filter_by(is_open=is_open)
        
    # Fetch all toilets  
    toilets = query.all()
    
    toilet_list = []
    for toilet in toilets:
        toilet_data = {
            'id': toilet.id,
            'name': toilet.name,
            'latitude': toilet.latitude,
            'longitude': toilet.longitude,
            'rating': toilet.rating,
            'num_ratings': toilet.num_ratings,
            'is_male': toilet.is_male,
            'is_female': toilet.is_female,
            'is_accessible': toilet.is_accessible,
            'is_open': toilet.is_open,
            'cleaniness_rating': toilet.cleaniness_rating,
            'description': toilet.description
        }
                
        # Calculate distance if coordinates provided
        if lat and lon:
            distance = haversine(lat, lon, toilet.latitude, toilet.longitude)
            toilet_data['distance'] = distance
        
        toilet_list.append(toilet_data)
    
    # Sort by distance if coordinates provided
    if lat and lon:
        toilet_list.sort(key=lambda x: x.get('distance', float('inf')))
    
    return jsonify(toilet_list)

@app.route('/api/update-toilet/<int:toilet_id>', methods=['PUT'])
def update_toilet(toilet_id):
    data = request.json

    toilet = Toilet.query.get_or_404(toilet_id)
    if 'name' in data:
        toilet.name = data['name']
    if 'location' in data:
        toilet.location = data['location']  
    if 'latitude' in data:
        toilet.latitude = data['latitude']
    if 'longitude' in data:
        toilet.longitude = data['longitude']
    if 'is_male' in data:
        toilet.is_male= data['is_male']
    if 'is_female' in data:
        toilet.is_female = data['is_female']
    if 'is_accessible' in data:
        toilet.is_accessible = data['is_accessible']    
    if 'is_open' in data:
        toilet.is_open = data['is_open']
    if 'cleaniness_rating' in data:
        toilet.cleaniness_rating = data['cleaniness_rating']
    if 'description' in data:
        toilet.description = data['description']
    db.session.commit()
    return jsonify({'message': 'Toilet updated successfully', 'toilet_id': toilet.id})            
        
@app.route('/api/delete-toilet/<int:toilet_id>', methods=['DELETE'])

def delete_toilet(toilet_id):
    toilet = Toilet.query.get_or_404(toilet_id)
    
    db.session.delete(toilet)
    db.session.commit()
    
    return jsonify({'message': 'Toilet deleted successfully', 'toilet_id': toilet.id})

@app.route('/api/open-toillets', methods=['GET', 'POST'])
def get_open_toilets():
    try:
        # Check if coordinates are provided via POST request
        if request.method == 'POST' and request.is_json:
            data = request.json
            lat = data.get('lat')
            lng = data.get('lng')
        else:
            # If not POST or not JSON, check for URL parameters
            lat = request.args.get('latitude', type=float)
            lng = request.args.get('longitude', type=float)
        
        # Query only open toilets
        query = Toilet.query.filter_by(is_open=True)
        
        # Fetch all open toilets
        toilets = query.all()
        
        toilet_list = []
        for toilet in toilets:
            toilet_data = {
                'id': toilet.id,
                'name': toilet.name,
                'latitude': toilet.latitude,
                'longitude': toilet.longitude,
                'rating': toilet.rating,
                'num_ratings': toilet.num_ratings,
                'is_male': toilet.is_male,
                'is_female': toilet.is_female,
                'is_accessible': toilet.is_accessible,
                'is_open': toilet.is_open,
                'cleaniness_rating': toilet.cleaniness_rating,
                'description': toilet.description
            }
            
            # Calculate distance if coordinates provided
            if lat is not None and lng is not None:
                try:
                    distance = haversine(float(lat), float(lng), toilet.latitude, toilet.longitude)
                    toilet_data['distance'] = distance
                except (TypeError, ValueError) as e:
                    print(f"Error calculating distance: {e}")
            
            toilet_list.append(toilet_data)
        
        # Sort by distance if coordinates provided
        if lat is not None and lng is not None:
            toilet_list.sort(key=lambda x: x.get('distance', float('inf')))
        
        return jsonify(toilet_list)
    
    except Exception as e:
        print(f"Error in get_open_toilets: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/', methods=['GET'])
def index():
    return jsonify({"status": "ok", "message": "Toilet Finder API is running"}), 200    

#Create the database
with app.app_context():
    
    db.create_all()    
    
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host='0.0.0.0', port=port) 