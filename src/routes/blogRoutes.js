import express  from "express";
import fileUpload from "../helper/multer";
import { addComment, createBlog, deleteBlog, selectBlog, selectById, updateBlog } from "../controllers/blogControllers";
import Authorization  from "../middleware/Aunthentication"
import userAunthentication from "../middleware/userAunthentication";

const blogRoutes = express.Router();

blogRoutes.post("/create",Authorization, fileUpload.single("blogImage"), createBlog);
blogRoutes.get("/select", selectBlog);
blogRoutes.get("/selectById/:id", selectById);
blogRoutes.delete("/delete/:id",Authorization, deleteBlog);
blogRoutes.put("/update/:id",Authorization,fileUpload.single("blogImage"), updateBlog );
blogRoutes.post("/comment/:id",userAunthentication, fileUpload.single("blogImage"), addComment);
// blogRoutes.get("/getComment/:id", getComments);

export default blogRoutes