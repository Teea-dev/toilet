import sys
import os
import json
from flask import current_app
from app import app, db, Toilet  # Import the app and db from your main app file

def create_tables():
    """Create database tables if they don't exist."""
    with app.app_context():
        db.create_all()
        print("Database tables created successfully.")

def populate_database():
    """Populate the database with predefined toilet locations."""
    UI_TOILET_LOCATIONS = [
        {
            "name": "Engineering Building Toilet",
            "latitude": 7.44108,
            "longitude": 3.90420,
            "is_male": True,
            "is_female": True,
            "is_accessible": True,
            "is_open": True,
            "cleaniness_rating": 4.2,
            "description": "Modern facility with multiple stalls for both male and female students."
        },
        {
            "name": "Access Bank Toilet",
            "latitude": 7.442,
            "longitude": 3.903,
            
            "is_male": True,
            "is_female": True,
            "is_accessible": True,
            "is_open": True,
            "cleaniness_rating": 4.5,
            "description": "Spacious and well-maintained restroom near study areas."
        },
        {
            "name": "Arts Faculty Toilet",
            "latitude": 7.44060,
            "longitude": 3.90380,
            "is_male": True,
            "is_female": True,
            "is_accessible": False,
            "is_open": True,
            "cleaniness_rating": 3.7,
            "description": "Basic facility with limited accessibility."
        }
    ]

    with app.app_context():
        # Clear existing data
        db.session.query(Toilet).delete()
        
        # Add new toilets
        for toilet_data in UI_TOILET_LOCATIONS:
            new_toilet = Toilet(**toilet_data, rating=0.0, num_ratings=0)
            db.session.add(new_toilet)
        
        # Commit changes
        db.session.commit()
        print(f"Successfully added {len(UI_TOILET_LOCATIONS)} toilet locations to the database.")

def export_toilets_to_json():
    """Export current database toilets to a JSON file."""
    with app.app_context():
        toilets = Toilet.query.all()
        toilet_list = []
        
        for toilet in toilets:
            toilet_dict = {
                "name": toilet.name,
                "latitude": toilet.latitude,
                "longitude": toilet.longitude,
                "is_male": toilet.is_male,
                "is_female": toilet.is_female,
                "is_accessible": toilet.is_accessible,
                "is_open": toilet.is_open,
                "cleaniness_rating": toilet.cleaniness_rating,
                "description": toilet.description
            }
            toilet_list.append(toilet_dict)
        
        with open('ui_toilets.json', 'w') as f:
            json.dump(toilet_list, f, indent=4)
        
        print("Toilet locations exported to ui_toilets.json")

def import_toilets_from_json(file_path):
    """Import toilet locations from a JSON file."""
    with app.app_context():
        with open(file_path, 'r') as f:
            toilet_data = json.load(f)
        
        # Clear existing data
        db.session.query(Toilet).delete()
        
        # Add toilets from JSON
        for toilet_info in toilet_data:
            new_toilet = Toilet(**toilet_info, rating=0.0, num_ratings=0)
            db.session.add(new_toilet)
        
        db.session.commit()
        print(f"Successfully imported {len(toilet_data)} toilet locations from {file_path}")

def main():
    """Main menu for database operations."""
    print("Toilet Database Population Script")
    print("1. Populate Database with Predefined Locations")
    print("2. Export Current Toilets to JSON")
    print("3. Import Toilets from JSON")
    
    choice = input("Enter your choice (1-3): ")
    
    if choice == '1':
        populate_database()
    elif choice == '2':
        export_toilets_to_json()
    elif choice == '3':
        file_path = input("Enter the path to the JSON file: ")
        import_toilets_from_json(file_path)
    else:
        print("Invalid choice. Exiting.")

if __name__ == '__main__':
    main()