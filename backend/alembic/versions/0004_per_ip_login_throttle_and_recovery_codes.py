"""per ip login throttle and recovery codes

Revision ID: 0004
Revises: 0003
Create Date: 2026-11-25 19:22:35.571910
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '0004'
down_revision = '0003'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table('login_throttle',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('ip', sa.String(), nullable=False),
    sa.Column('failed', sa.Integer(), nullable=False),
    sa.Column('locked_until', sa.DateTime(timezone=True), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('username', 'ip', name='uq_login_throttle_username_ip')
    )
    op.create_index(op.f('ix_login_throttle_username'), 'login_throttle', ['username'], unique=False)
    op.add_column('users', sa.Column('recovery_codes', postgresql.ARRAY(sa.String()), nullable=True))
    op.drop_column('users', 'failed_logins')
    op.drop_column('users', 'locked_until')


def downgrade() -> None:
    op.add_column('users', sa.Column('locked_until', postgresql.TIMESTAMP(timezone=True), autoincrement=False, nullable=True))
    op.add_column('users', sa.Column('failed_logins', sa.INTEGER(), server_default=sa.text('0'), autoincrement=False, nullable=False))
    op.drop_column('users', 'recovery_codes')
    op.drop_index(op.f('ix_login_throttle_username'), table_name='login_throttle')
    op.drop_table('login_throttle')
