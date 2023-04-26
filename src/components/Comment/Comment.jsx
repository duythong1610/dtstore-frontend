import { useQuery } from "@tanstack/react-query";
import React from "react";
import * as ProductService from "../../services/ProductService";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import InputComponent from "../InputComponent/InputComponent";
import {
  FieldTimeOutlined,
  CheckCircleFilled,
  SendOutlined,
} from "@ant-design/icons";
import * as message from "../Message/Message";
const Comment = ({ idProduct }) => {
  const user = useSelector((state) => state.user);
  const [commentText, setCommentText] = useState({ text: "", createAt: "" });
  const [productDetails, setProductDetails] = useState([]);
  const fetchProductDetails = async () => {
    const res = await ProductService.getDetailsProduct(idProduct);
    setProductDetails(res.data);
    // return res.data;
  };

  useEffect(() => {
    fetchProductDetails();
  }, [idProduct]);

  const handleComment = async () => {
    if (commentText.text) {
      const res = await ProductService.postComment(
        productDetails?._id,
        commentText,
        user?.access_token
      );
      if (res) {
        message.success("Gửi đánh giá thành công");
        fetchProductDetails();
        setCommentText({ text: "", createAt: "" });
      }
      return res;
    } else {
      message.error("Vui lòng nhập nội dung đánh giá");
    }
  };
  const onChangeComment = (e) => {
    setCommentText({
      text: e.target.value,
      createAt: new Date(),
    });
  };

  return (
    <div
      style={{
        maxWidth: "1270px",
        borderRadius: "12px",
        margin: "0 auto",
      }}
    >
      <p className="text-base md:text-2xl px-4 mb-2 font-medium">
        {" "}
        Đánh giá sản phẩm:
      </p>

      <div className="comment-list px-4 scrollbar-hide overflow-x-hidden overflow-y-auto max-h-96">
        {productDetails?.comments?.map((comment) => {
          const timeAgo = Math.floor(
            (new Date().getTime() - new Date(comment?.createAt).getTime()) /
              (1000 * 60)
          );

          const timeJoin = Math.floor(
            (new Date().getTime() -
              new Date(comment?.postedBy?.createdAt).getTime()) /
              (1000 * 60)
          );

          const timeAgoRender = (timeAgo) => {
            if (timeAgo > 59 && timeAgo < 1439) {
              let hour = Math.floor(timeAgo / 60);
              return hour + " giờ trước";
            } else if (timeAgo > 1439) {
              let day = Math.floor(timeAgo / 60 / 24);
              return day + " ngày trước";
            } else {
              return timeAgo === 0 ? "Vừa xong" : timeAgo + " phút trước";
            }
          };

          const timeJoinRender = (timeJoin) => {
            if (timeJoin > 59 && timeJoin < 1439) {
              let hour = Math.floor(timeJoin / 60);
              return "Đã tham gia " + hour + " giờ";
            } else if (timeJoin > 1439) {
              let day = Math.floor(timeJoin / 60 / 24);
              return "Đã tham gia " + day + " ngày";
            } else {
              return "Đã tham gia " + timeJoin + " phút";
            }
          };

          return (
            <>
              <div className="comment-item w-full md:w-6/12 bg-white md:p-4 p-2 mb-2 rounded-xl">
                <div className="user-top gap-5 flex justify-between items-center mb-1 md:mb-2">
                  <div
                    className="user-info"
                    style={{ display: "flex", gap: 10, alignItems: "center" }}
                  >
                    <div className="user-img">
                      <img
                        className="w-8 h-8 md:w-12 md:h-12 rounded-full object-cover"
                        src={comment?.postedBy?.avatar}
                        alt=""
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 w-24">
                        <h1 className="user-name m-0 text-sm md:text-base one-line max-w-[100px]">
                          {comment?.postedBy?.name}
                        </h1>
                        {comment?.postedBy?.isAdmin && (
                          <CheckCircleFilled className="text-blue-500" />
                        )}
                      </div>
                      <h2 className="text-xs md:text-sm font-normal m-0">
                        {timeJoinRender(timeJoin)}
                      </h2>
                    </div>
                  </div>
                  <div className="user-time justify-between flex-auto flex mb-3 md:mb-5 gap-2 md:gap-3">
                    <span className="flex items-center text-xs md:text-base">
                      {comment?.createAt && (
                        <FieldTimeOutlined style={{ marginRight: "5px" }} />
                      )}
                      {timeAgoRender(timeAgo)}
                    </span>
                    <span className="text-xs md:text-base">
                      {new Date(comment?.createAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="user-bottom">
                  <p className="text-sm md:text-base md:ml-14 ml-[42px]">
                    {comment?.text}
                  </p>
                </div>
              </div>
            </>
          );
        })}
      </div>

      <div className="w-full md:w-1/2 flex flex-col gap-2 p-4 md:p-0  ">
        <div className="mb-[20%] md:mb-0 gap-2 md:p-5 p-2 md:h-28 h-20 rounded-xl bg-white">
          <div className="flex items-center gap-4">
            <img
              src={
                user?.avatar ||
                "https://hacom.vn/media/lib/15-06-2021/che-do-an-danh.jpg"
              }
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              alt="user-avatar"
            />
            <textarea
              className="mt-3 w-full md:h-20 h-10 border-none outline-none"
              placeholder={"Viết đánh giá..."}
              value={commentText?.text}
              type="text"
              onChange={onChangeComment}
            />
            <SendOutlined
              onClick={handleComment}
              className={
                commentText?.text !== "" ? "text-blue-600" : "text-zinc-500"
              }
            />
          </div>
        </div>
        {/* {commentText?.text && (
          <ButtonComponent
            style={{
              color: "rgb(255, 255, 255)",
              background: "rgb(66, 42, 251)",
              fontSize: "15px",
              fontWeight: 600,
              height: "38px",
              width: "150px",
              border: "none",
              borderRadius: "12px",
              placeSelf: "flex-end",
            }}
            textButton={"Gửi đánh giá"}
            onClick={handleComment}
          ></ButtonComponent>
        )} */}
      </div>
    </div>
  );
};

export default Comment;
