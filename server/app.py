#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask,request, make_response, abort, session, jsonify
from flask_restful import Resource
from flask_login import LoginManager, login_user, current_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
# Local imports
from config import app, db, api
# Add your model imports
from models import db, Inventory, User, Convention, Sale
app.secret_key = 'mfqCNPUsPQ'


# Views go here!
login_manager = LoginManager(app)
login_manager.login_view = "login" 

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id)) 

@app.route('/protected')
@login_required
def protected():
    return 'Protected Area'

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class InventoryResource(Resource):
        method_decorators = [login_required]
        def get(self):
            if not current_user.is_authenticated:
                return {'message': 'User not logged in'}, 401
            inventory_list = [inventory.to_dict() for inventory in db.session.query(Inventory).all()]
            return make_response(inventory_list,200)
        
        def post(self):
            app.logger.debug('Attempting to add inventory for user: %s', current_user.username)
            try:
                
                user_id = current_user.get_id()

                new_inventory = Inventory(
                    name=request.json["name"],
                    price=int(request.json["price"]),
                    quantity=int(request.json["quantity"]),
                    user_id=int(user_id)  
                )
                db.session.add(new_inventory)
                db.session.commit()
                return make_response(new_inventory.to_dict(), 201)
            except Exception as e:
                app.logger.error('Failed to add new inventory item: %s', str(e))
                return make_response({"error": "An error occurred"}, 400)
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
            inventory = Inventory.query.filter_by(user_id=id).all()
            return make_response([item.to_dict() for item in inventory],200)
        except:
            return make_response({"error" : "Inventory by Id error"})
    
api.add_resource(InventoryById,"/inventory/user/<int:id>")

class ItemById(Resource):
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
                if key == 'quantity' or key == 'price':
                    setattr(inventory, key, int(request_json[key]))
                else:
                    setattr(inventory, key, request_json[key])
            db.session.add(inventory)
            db.session.commit()

            return make_response(inventory.to_dict(), 200)
        except:
            return make_response({"error" : "Inventory patch error"}, 404)
api.add_resource(ItemById,"/inventory/<int:id>")

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and user.check_password(password):
        login_user(user, remember=True)  
        session['user_id'] = user.id
        return jsonify({'message': 'Login successful', 'user_id': user.id}), 200
    elif user:
        app.logger.debug('Incorrect password attempt for user: %s', username)
        return make_response({'message': 'Incorrect password'}, 401)
    else:
        app.logger.debug('No user found with username: %s', username)
        return make_response({'message': 'User not found'}, 404)

    
@app.route('/check_session')
def check_session():
    print('Checking session:', dict(session))  
    user_id = session.get('user_id')
    if user_id:
        return jsonify({'message': f'User ID in session: {user_id}'}), 200
    else:
        return jsonify({'message': 'No user ID in session'}), 401
    

@app.route('/sales', methods=['POST'])
def create_sale():
    data = request.get_json()
    item_id = data.get('item_id')
    user_id = data.get('user_id')
    price = data.get('price')
    new_sale = Sale(inventory_id=item_id, user_id=user_id, total_sales=price)
    db.session.add(new_sale)
    db.session.commit()

    return jsonify({'message': 'Sale created', 'sale': new_sale.to_dict()}), 201

@app.route('/total-sales/<int:user_id>', methods=['GET'])
def get_total_sales(user_id):
    total_sales = db.session.query(db.func.sum(Sale.total_sales)).filter(Sale.user_id == user_id).scalar()
    return jsonify({'total_sales': total_sales})

@app.route('/users/<int:user_id>/inventory_names', methods=['GET'])
def get_user_inventory_names(user_id):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({'error': 'User not found'}), 404
    inventory_names = [name for name in user.inventory_names]
    return jsonify({'inventory_names': inventory_names})



if __name__ == '__main__':
    app.run(port=5555, debug=True)

