#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask,request, make_response, abort, session, jsonify
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import db, Inventory

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'
class InventoryResource(Resource):
        def get(self):
            inventory_list = [inventory.to_dict() for inventory in db.session.query(Inventory).all()]
            return make_response(inventory_list,200)
        
        def post(self):
            try:
                new_inventory = Inventory(
                    name = request.json["name"],
                    price = request.json["price"],
                    quantity = request.json["quantity"]
                )
                db.session.add(new_inventory)
                db.session.commit()

                return make_response(new_inventory.to_dict(),201)
            except:
                return make_response({"error" : ["Validation errors"]},404)
api.add_resource(InventoryResource,"/inventory")


if __name__ == '__main__':
    app.run(port=5555, debug=True)

