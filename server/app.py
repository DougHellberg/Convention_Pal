#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask,request, make_response, abort, session, jsonify
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import db, Inventory, User, Convention

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

class UserList(Resource):
    def get(self):
        user_list =[user.to_dict() for user in db.session.query(User).all()]
        return make_response(user_list,200)
    def post(self):
            try:
                new_user = User(
                    username = request.json["username"],
                    password = request.json["password"],
                    name = request.json["name"]
                )
                db.session.add(new_user)
                db.session.commit()

                return make_response(new_user.to_dict(),201)
            except:
                return make_response({"error" : ["Validation errors"]},404)
api.add_resource(UserList,"/user")

class ConventionList(Resource):
    def get(self):
        convention_list=[convention.to_dict() for convention in db.session.query(Convention).all()]
        return make_response(convention_list,200)
    def post(self):
        try:
            new_convention = Convention(
                name = request.json["name"],
                num_of_days = request.json["num_of_days"],
                table_cost = request.json["table_cost"]
            )
            db.session.add(new_convention)
            db.session.commit()
            return make_response(new_convention.to_dict(),201)
        except:
            return make_response({"error" : ["Validation errors"]},404)
api.add_resource(ConventionList,"/convention")

class InventoryById(Resource):
    def get(self,id):
        try:
            inventory = Inventory.query.filter_by(id=id).first()
            return make_response(inventory.to_dict(),200)
        except:
            return make_response({"error" : "Inventory by Id error"})
    def delete(self, id):
        try:
            inventory = Inventory.query.filter_by(id = id).first()

            db.session.delete(inventory)
            db.session.commit()

            return make_response({}, 202)
        except:
            return make_response({"error" : "Inventory delete error"}, 404)
    def patch(self, id):
        try:
            inventory = Inventory.query.filter_by(id = id).one_or_none()

            request_json = request.get_json()

            for key in request_json:
                setattr(inventory, key, request_json[key])

            db.session.add(inventory)
            db.session.commit()

            return make_response(inventory.to_dict(), 200)
        except:
            return make_response({"erorr" : "Inventory patch error"}, 404)
api.add_resource(InventoryById,"/inventory/<int:id>")


if __name__ == '__main__':
    app.run(port=5555, debug=True)

