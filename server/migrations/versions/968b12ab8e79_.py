"""empty message

Revision ID: 968b12ab8e79
Revises: 7c49ad9c84de
Create Date: 2023-11-01 00:06:28.060287

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '968b12ab8e79'
down_revision = '7c49ad9c84de'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('Inventory', schema=None) as batch_op:
        batch_op.drop_column('inv_image')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('Inventory', schema=None) as batch_op:
        batch_op.add_column(sa.Column('inv_image', sa.VARCHAR(), nullable=True))

    # ### end Alembic commands ###
