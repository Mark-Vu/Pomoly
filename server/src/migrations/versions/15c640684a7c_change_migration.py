"""change  migration.

Revision ID: 15c640684a7c
Revises: 
Create Date: 2023-11-02 00:57:38.705565

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '15c640684a7c'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('calendars', schema=None) as batch_op:
        batch_op.create_foreign_key(None, 'users', ['user_id'], ['id'], ondelete='CASCADE')

    with op.batch_alter_table('events', schema=None) as batch_op:
        batch_op.drop_constraint('events_calendar_id_fkey', type_='foreignkey')
        batch_op.create_foreign_key(None, 'calendars', ['calendar_id'], ['id'], ondelete='CASCADE')

    with op.batch_alter_table('verification_codes', schema=None) as batch_op:
        batch_op.create_foreign_key(None, 'users', ['user_id'], ['id'], ondelete='CASCADE')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('verification_codes', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')

    with op.batch_alter_table('events', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('events_calendar_id_fkey', 'calendars', ['calendar_id'], ['id'])

    with op.batch_alter_table('calendars', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')

    # ### end Alembic commands ###