import mongoose from "mongoose"

export interface IUser {
  _id?: string
  clerkId: string
  email: string
  firstName?: string
  lastName?: string
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
