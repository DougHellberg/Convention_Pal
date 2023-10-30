from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from config import db

class Inventory(db.model, SerializerMixin):
    __tablename__ = 'inventories'

    #Establishing columns
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    price = db.Column(db.Integer)
    quantity = db.Column(db.Integer)

    #Add relationships
    sales = db.relationship(
        "Sale", backref = "inventory",cascade="all,delete"
    )
    # Add serialization rules
    serialize_rules=("-sales.inventory",)

    #Adding Validations
    @validates('name')
    def validates_name(self,key,name):
        if not name or len(name)<1:
            raise ValueError("Must contain name!")
        return name
    
    @validates('price')
    def validates_price(self,key,price):
        if not price or price <1:
            raise ValueError("Must contain a price!")
        return price
    
    @validates('quantity')
    def validates_price(self,key,quantity):
        if not quantity or quantity <=0:
            raise ValueError("Quantity cant be less then 0!")
        return quantity

    

class User(db.model, SerializerMixin):
    __tablename__ = 'users'

    #Establishing columns
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    password = db.Column(db.String)
    name = db.Column(db.String)

    #Adding relationships
    sales = db.relationship(
        "Sale", backref = "user",cascade="all,delete"
    )
    # Add serialization rules
    serialize_rules=("-sales.user",)

    #Adding validations
    @validates('name','username','password')
    def validates_name(self,key,text):
        if not text or len(text)<1:
            raise ValueError("Name, Username and password must fit criteria!")
        return text

    


class Convention(db.model, SerializerMixin):
    __tablename__ = 'conventions'

    #Establishing columns
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    num_of_days = db.Column(db.Integer)
    table_cost = db.Column(db.Integer)
    #Add relationships
    sales = db.relationship(
        "Sale", backref = "convention",cascade="all,delete"
    )

    # Add serialization rules
    serialize_rules=("-sales.convention",)

    #Adding validations
    @validates('name')
    def validates_name(self,key,name):
        if not name or len(name)<1:
            raise ValueError("Must contain name!")
        return name

    @validates('num_of_days')
    def validates_numOfDays(self,key,numOfDays):
        if not numOfDays or numOfDays<0:
            raise ValueError("Must contain a number of days more than 0!") 
        
    @validates('table_cost')
    def validates_tableCost(self,key,tableCost):
        if not tableCost or tableCost<0:
            raise ValueError("Tables must cost more the $0!")

class Sale(db.model, SerializerMixin):
    __tablename__ = 'sales'

    #Establishing columns
    id = db.Column(db.Integer, primary_key=True)
    total_sales = db.Column(db.Integer)

    #Add relationships
    user_id = db.Column(db.Integer,db.ForeignKey("users.id"))
    convention_id = db.Column(db.Integer,db.ForeignKey("conventions.id"))
    inventory_id = db.Column(db.Integer,db.ForeignKey("inventories.id"))

    #Adding validations
    @validates('name')
    def validates_name(self,key,name):
        if not name or len(name)<1:
            raise ValueError("Must contain name!")
        return name
    
    @validates('user_id')
    def validates_user_id(self,key,user_id):
        if not user_id:
            raise ValueError("Must contain a user id!")
        return user_id
    
    @validates('inventory_id')
    def validates_inventory_id(self,key,inventory_id):
        if not inventory_id:
            raise ValueError("Must contain a inventory id!")
        return inventory_id
