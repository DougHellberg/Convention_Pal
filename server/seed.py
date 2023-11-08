#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db,Inventory,Convention,User,Sale
fake = Faker()
with app.app_context():
    inventorys = []
    for n in range(5):
        inventory = Inventory(name=fake.first_name(), price=randint(1, 50), quantity=randint(0, 50))
        inventorys.append(inventory)

    
    
    conventions = []
    for n in range(5):
        convention = Convention(name=fake.first_name(),num_of_days = randint(1,6),table_cost=randint(1,1500))
        conventions.append(convention)

    print("Clearing out table!")
    
    print("Seeding Inventory...")
    

# Create a new inventory item
    

    # Create a new sale
    new_sale = Sale(total_sales=1, inventory_id=new_inventory.id, user_id=new_user.id)
    db.session.add(new_sale)
    db.session.commit()

    # Now, you should be able to access the name of the inventory item sold by the user through the association proxy
    print(new_user.inventory_names)
        
        

    print("Done Seeding!")