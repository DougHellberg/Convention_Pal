#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask,request, make_response, abort, session, jsonify
from flask_restful import Resource
from flask_login import LoginManager, login_user
from werkzeug.security import generate_password_hash, check_password_hash
# Local imports
from config import app, db, api
# Add your model imports
from models import db, Inventory, User, Convention
app.secret_key = 'mfqCNPUsPQ'

# Views go here!
login_manager = LoginManager(app)
login_manager.login_view = "login" 

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
                    price = int(request.json["price"]),
                    quantity = int(request.json["quantity"])
                )
                db.session.add(new_inventory)
                db.session.commit()

                return make_response(new_inventory.to_dict(),201)
            except:
                return make_response({"error" : ["Validation errors"]},400)
api.add_resource(InventoryResource,"/inventory")

class UserList(Resource):
    def get(self):
        user_list = [user.to_dict() for user in db.session.query(User).all()]
        return make_response(user_list, 200)

    def post(self):
        try:
            existing_user = User.query.filter_by(username=request.json["username"]).first()
            if existing_user:
                return make_response({"error": "Username already exists"}, 400)

            new_user = User(
                username=request.json["username"],
                name=request.json["name"]
            )
            # Set the password hash
            new_user.set_password(request.json["password"])

            db.session.add(new_user)
            db.session.commit()

            return make_response(new_user.to_dict(), 201)
        except:
            return make_response({"error": ["Validation errors"]}, 400)

api.add_resource(UserList, "/user")

class ConventionList(Resource):
    def get(self):
        convention_list=[convention.to_dict() for convention in db.session.query(Convention).all()]
        return make_response(convention_list,200)
    def post(self):
        try:
            new_convention = Convention(
                name = request.json["name"],
                num_of_days = int(request.json["num_of_days"]),
                table_cost = int(request.json["table_cost"])
            )
            db.session.add(new_convention)
            db.session.commit()
            return make_response(new_convention.to_dict(),201)
        except:
            return make_response({"error" : ["Validation errors"]},404)
api.add_resource(ConventionList,"/convention")

class ConventionById(Resource):
    def delete(self, id):
        try:
            convention = Convention.query.filter_by(id = id).first()
            if convention:
                db.session.delete(convention)
                db.session.commit()
                return make_response({}, 202)
            else:
                return make_response({"error": "Convention not found"}, 404)
        except:
            return make_response({"error" : "Convention delete error"}, 500)
api.add_resource(ConventionById,"/convention/<int:id>")

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
            if inventory:
                db.session.delete(inventory)
                db.session.commit()
                return make_response({}, 202)
            else:
                return make_response({"error": "Inventory not found"}, 404)
        except:
            return make_response({"error" : "Inventory delete error"}, 500)
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

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    
    if user:
        if user.check_password(password):
            login_user(user)
            return make_response({'message': 'Login successful'}, 200)
        else:
            return make_response({'message': 'Incorrect password'}, 401)
    else:
        return make_response({'message': 'User not found'}, 404)



if __name__ == '__main__':
    app.run(port=5555, debug=True)

