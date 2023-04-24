import { useQuery } from "@tanstack/react-query";
import React from "react";
import * as ProductService from "../../services/ProductService";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import InputComponent from "../InputComponent/InputComponent";
import { FieldTimeOutlined } from "@ant-design/icons";
import * as message from "../Message/Message";
const Comment = ({ idProduct }) => {
  const user = useSelector((state) => state.user);
  console.log({ user });
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

  console.log(productDetails);

  const handleComment = async () => {
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
        width: "1270px",
        borderRadius: "12px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "24px", padding: "12px 0" }}>
        {" "}
        Đánh giá sản phẩm:
      </h1>

      <div
        className="comment-list"
        style={{ maxHeight: "400px", overflowX: "hidden", overflowY: "auto" }}
      >
        {productDetails?.comments?.map((comment) => {
          console.log({ comment });
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
              return timeAgo + " phút trước";
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
              <div
                className="comment-item"
                style={{
                  width: "700px",
                  marginBottom: "30px",
                  background: "rgb(255, 255, 255)",
                  borderRadius: "12px",
                  padding: "10px 20px",
                }}
              >
                <div
                  className="user-top"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    className="user-info"
                    style={{ display: "flex", gap: 10, alignItems: "center" }}
                  >
                    <div className="user-img">
                      <img
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                        className="avatar"
                        src={comment?.postedBy?.avatar}
                        alt=""
                      />
                    </div>
                    <div>
                      <h1
                        className="user-name"
                        style={{ margin: 0, fontSize: "16px" }}
                      >
                        {comment?.postedBy?.name}
                      </h1>
                      <h2
                        style={{ margin: 0, fontSize: "13px", fontWeight: 400 }}
                      >
                        {timeJoinRender(timeJoin)}
                      </h2>
                    </div>
                  </div>
                  <div
                    className="user-time"
                    style={{ display: "flex", gap: "10px" }}
                  >
                    <div>
                      {comment?.createAt && (
                        <FieldTimeOutlined style={{ marginRight: "5px" }} />
                      )}
                      {timeAgoRender(timeAgo)}
                    </div>
                    <div>
                      {new Date(comment?.createAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="user-bottom">
                  <p style={{ marginLeft: "60px" }}>{comment?.text}</p>
                </div>
              </div>
            </>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          width: "700px",
        }}
      >
        <div
          style={{
            marginTop: "30px",
            gap: 10,
            padding: "20px",
            height: "120px",
            borderRadius: "12px",
            background: "#fff",
          }}
        >
          <div style={{ display: "flex", gap: 15 }}>
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
              style={{
                width: "100%",
                height: "80px",
                border: "none",
                outline: "none",
                marginTop: "15px",
              }}
              placeholder={"Viết đánh giá..."}
              value={commentText?.text}
              type="text"
              onChange={onChangeComment}
            />
          </div>
        </div>
        {commentText?.text && (
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
        )}
      </div>
    </div>
  );
};

export default Comment;
