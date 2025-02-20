import { Model, DataTypes, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';

export class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password_hash!: string;
  public is_verified!: boolean;
  public last_login!: Date;

  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash);
  }
}

export const initUser = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      last_login: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: true, // Auto add createdAt & updatedAt
    }
  );

  // Hash password before saving
  User.beforeCreate(async (user) => {
    user.password_hash = await bcrypt.hash(user.password_hash, 10);
  });

  User.beforeUpdate(async (user) => {
    if (user.changed('password_hash')) {
      user.password_hash = await bcrypt.hash(user.password_hash, 10);
    }
  });
};
