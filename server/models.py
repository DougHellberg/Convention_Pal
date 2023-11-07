from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from flask_login import UserMixin
from sqlalchemy.orm import validates
from werkzeug.security import generate_password_hash, check_password_hash
from config import db

class Inventory(db.Model, SerializerMixin):
    __tablename__ = 'Inventory'

    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    name = db.Column(db.String)
    price = db.Column(db.Integer)
    quantity = db.Column(db.Integer)
    
    

    #Add relationships
    #sales = db.relationship("Sale", backref="inventory_sales", cascade="all,delete")

    #Serialize rules
    #serialize_rules=("-sales.inventory",)

    #Adding Validations
    @validates('name')
    def validates_name(self,key,name):
        if not name or len(name)<1:
            raise ValueError("Must contain name with a length between 1 and 30!")
        return name
    
    @validates('price')
    def validates_price(self,key,price):
        if price <1 or price >50:
            raise ValueError("Must contain a price between 1 and 50!")
        return price
    
    @validates('quantity')
    def validates_quantity(self,key,quantity):
        if not 0 <= quantity <=50:
            raise ValueError("Quantity cant be less then 0 or more then 50!")
        return quantity

class User(db.Model,SerializerMixin, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String)
    password = db.Column(db.String)
    name = db.Column(db.String)
    password_hash = db.Column(db.String)

    sales = db.relationship("Sale", backref="user", cascade="all,delete")

    inventory_names = association_proxy('sales', 'inventory_name')
    
    #Serialize rules
    serialize_rules=("-sales.user",)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def is_active(self):
        return True
    
    def get_id(self):
        return str(self.id)

    #Adding validations
    @validates('password')
    def validate_password(self, key, password):
        if not password or len(password) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        return password
    

class Convention(db.Model, SerializerMixin):
    __tablename__ = 'conventions'

    #Establishing columns
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    num_of_days = db.Column(db.Integer)
    table_cost = db.Column(db.Integer)

    

    #Serialize rules
    

    #Adding validations
    @validates('name')
    def validates_name(self,key,name):
        if not name or len(name)<1:
            raise ValueError("Must contain name!")
        return name

    @validates('num_of_days')
    def validates_numOfDays(self,key,numOfDays):
        if not 0 < numOfDays <7:
            raise ValueError("Must contain a number of days more than 0 and less then 7!")
        return numOfDays 
        
    @validates('table_cost')
    def validates_tableCost(self,key,tableCost):
        if not 0 < tableCost < 1500:
            raise ValueError("Tables must cost more the $0!")
        return tableCost 
    

class Sale(db.Model, SerializerMixin, ):
    __tablename__ = 'sales'

    #Establishing columns
    id = db.Column(db.Integer, primary_key=True)
    total_sales = db.Column(db.Integer)

    #Add relationships
    inventory_id = db.Column(db.Integer,db.ForeignKey('Inventory.id'))
    user_id = db.Column(db.Integer,db.ForeignKey('users.id'))
    

    serialize_rules = ('-inventory', '-user')

    #relationships
    inventory = db.relationship("Inventory", backref="sale_inventory", overlaps="inventory_sales,sales")
    
    #association proxy
    inventory_name = association_proxy('inventory','name')

    #Adding validations
    @validates('name')
    def validates_name(self,key,name):
        if not name or len(name)<1:
            raise ValueError("Must contain name!")
        return name
    
    #@validates('user_id')
    #def validates_user_id(self,key,user_id):
    #   if not user_id:
    #       raise ValueError("Must contain a user id!")
    #   return user_id
    
    #@validates('inventory_id')
    #def validates_inventory_id(self,key,inventory_id):
    #   if not inventory_id:
    #      raise ValueError("Must contain a inventory id!")
    # return inventory_id




    


