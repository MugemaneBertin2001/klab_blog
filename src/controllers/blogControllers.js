import blog from "../Model/blogModules";
import {uploadToCloud} from "../helper/cloud";
import { Comment } from "../Model/blogModules";

// createBlog

export const createBlog = async (req,res) => {
    try{
        const {title,subheader,content,blogImage} = req.body;
        // const {firstname, lastname, email, password, profile} = req.body;
        const existingTitle = await blog.findOne({
            title: req.body.title,
        });
        if (existingTitle) {
            return res.status(500).json({
                status: "500",
                message: "Title already exist",
            });
        }
        let result;
        if(req.file) result = await uploadToCloud(req.file,res);

        const { lastname, profile } = req.users;
    
        const newBlog = await blog.create({
            title,
            subheader,
            content,
            blogImage: result?.secure_url,
            author:req._id
        });
        return res.status(201).json({
            status: "201",
            message: "Blog Created Successfully",
            data: newBlog
        })
    } catch (error) {
        return res.status(500).json({
            status: "500",
            message: "fail to Create user",
            error: error.message
        })
    }
}

// select a blog

export const selectBlog = async (req, res) => {
    try {
      const getBlog = await blog.find().populate({path:'comments', select: 'content author'}).populate({path:'author',model: 'user', select: 'first lastname profile'});
      return res.status(200).json({
        status: "Success",
        message: "Data Retrieved Successfully",
        data: getBlog,
      });
    } catch (error) {
      return res.status(500).json({
        status: "Failed",
        message: "Failed To Select Data",
        error: error.message,
      });
    }
  };


export const selectComments=async(req,res )=> {
    try{
        const getBlog = await comments.find();
        return res.status(200).json({
            status: "Sucess",
            message:"Data Retrieved Successfully",
            data:getBlog
        })
    }
    catch(error){
        return res.status(500).json({
            status: "Failed",
            message: "Failed To Select Data",
            error : error.message
        })
    }

}

// delete
export const deleteBlog = async (req,res) => {
    try{
        const {id} = req.params
        const checkId = await blog.findById(id);
        if(!checkId){
            return  res.status(404).json({
                message:"Id Not Found!"
            })
        }
        const deleteB = await blog.findByIdAndDelete(id);
        return res.status(200).json({
            status : "sucess",
            message : "data deleted successfully",
            data : deleteB

        })

    }
    catch(error){
        return res.status(500).json({
            status : "failed",
            message : "Failed To deletee",
            error: error.message
        })

    }
}

export const selectById = async (req,res) => {
    try{
        const {id} = req.params
        const checkId = await blog.findById(id).populate({path:'comments', select: 'content author'});
        if(!checkId){
            return  res.status(404).json({
                message:"Post Not Found!"
            })
        }
        return res.status(200).json({
            status : "sucess",
            message : "data retrieved successfully",
            data : checkId

        })

    }
    catch(error){
        return res.status(500).json({
            status : "failed",
            message : "Failed To retrieve post",
            error: error.message
        })

    }
}

// update 

export const updateBlog = async(req,res) => {
    try{
        const {id} = req.params;
        const {title,subheader,content,blogImage} = req.body;
        const checkId = await blog.findById(id);
        if(!checkId){
            return res.status(404).json({
                message: "This blog Not Found "
            })
        }
        let result;
        if(req.file) result = await uploadToCloud(req.file,res);
    
        const updateB = await blog.findByIdAndUpdate(id,{
            title,
            subheader,
            content,
            blogImage: result?.secure_url,

        });
        return res.status(200).json({
            status : "success",
            message : "well Data Updated!",
            data : updateB, 
        })
    }
    catch(error){
       return res.status(500).json({
        message : "Failed To update Info!",
        error : error.message,
       })
    }

}

export const addComment = async (req,res) =>{
    try {
        const { id } = req.params;
    
        // Create a new comment
        const newComment = await Comment.create({
          blogId:id,
          content: req.body.content,
          author: req.users._id, // Assuming you have an authenticated user
        });
    
        // Find the corresponding blog post
        const checkId = await blog.findById(id);
        if(!checkId){
            return res.status(404).json({
                message: "This blog Not Found "
            })
        }
    
        // Add the comment to the blog's comments array
        const updatedBlog = await blog.findByIdAndUpdate(
          id,
          {
            $push: { comments: newComment._id },
          },
          { new: true }
        );
    
        res.status(201).json({
          message: "Comment added successfully.",
          comment: newComment,
        });
      } catch (error) {
        res.status(500).json({
          message: "Failed to add a comment.",
          error: error.message,
        });
}} 