// import { userProfile } from "../models/userProfile.js";
import { experienceSchema } from "../schema/experience_schema.js";
import { userProfileSchema } from "../schema/user_profile_schema.js";
import { UserModel } from "../models/user_model.js";
import { Experience } from "../models/experience_model.js";

export const createExperience = async (req, res) => {
  try {
    const { error, value } = experienceSchema.validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const userSessionId = req.session.user.id;
   

    const user = await UserModel.findById(userSessionId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const experience = await Experience.create({ ...value, user: userSessionId });

    user.experiences.push(experience._id)

    await user.save();

    res.status(201).json({ experience });
  } catch (error) {
    console.log(error);
  }
};



export const getExperience = async (req, res) => {
  try {
    //we are fetching Experience that belongs to a particular user
    const userSessionId = req.session.user.id
    const allExperience = await Experience.find({ user: userSessionId });
    if (allExperience.length == 0) {
      return res.status(404).send("No Experience added");
    }
    res.status(200).json({ Experience: allExperience });
  } catch (error) {
    return res.status(500).json({error})
  }
};



export const patchExperience = async (req, res) => {
    try {
      const { error, value } = userProfileSchema.validate(req.body);
  
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
  
      const userSessionId = req.session.user.id; 
      const user = await UserModel.findById(userSessionId);
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      const experience = await Experience.findByIdAndUpdate(req.params.id, value, { new: true });
        if (!experience) {
            return res.status(404).send("experience not found");
        }
  
      res.status(200).json({ experience });
    } catch (error) {
      return res.status(500).json({error})
    }
  };


  export const deleteExperience = async (req, res) => {
    try {
     
  
      const userSessionId = req.session.user.id; 
      const user = await UserModel.findById(userSessionId);
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      const experience = await Experience.findByIdAndDelete(req.params.id);
        if (!experience) {
            return res.status(404).send("experience not found");
        }
  
        user.experiences.pull(req.params.id);
        await user.save();
      res.status(200).json("Experience deleted");
    } catch (error) {
      return res.status(500).json({error})
    }
  };
  