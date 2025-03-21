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
import likeSvg from "../../assets/img/like.svg";
import * as message from "../Message/Message";
import { Dropdown, Tooltip } from "antd";
import ModalComponent from "../ModalComponent/ModalComponent";
import default_avatar from "../../assets/img/default_avatar.png";
import "./customModal.css";
import Loading from "../LoadingComponent/Loading";
const Comment = ({ idProduct }) => {
  const user = useSelector((state) => state.user);
  const [commentText, setCommentText] = useState({ text: "", createAt: "" });
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [userLikeInfo, setUserLikeInfo] = useState("");
  const [loadingLike, setLoadingLike] = useState(false);
  const [replyId, setReplyId] = useState("");

  const [replyText, setReplyText] = useState({
    text: "",
    createAt: "",
    commentId: "",
  });
  const [productDetails, setProductDetails] = useState([]);
  const [commentId, setCommentId] = useState("");
  const [commentIdReplying, setCommentIdReplying] = useState("");
  const [commentIdReplyingTheReplying, setCommentIdReplyingTheReplying] =
    useState("");
  const fetchProductDetails = async () => {
    const res = await ProductService.getDetailsProduct(idProduct);
    setProductDetails(res.data);
    // return res.data;
  };

  const handleCancel = () => {
    setIsOpenModal(false);
  };

  useEffect(() => {
    fetchProductDetails();
  }, [idProduct]);

  const isValidText = commentText.text.trim();

  const handleComment = async () => {
    if (isValidText) {
      const res = await ProductService.postComment(
        productDetails?._id,
        commentText,
        user?.access_token
      );
      setCommentText({ text: "", createAt: "" });
      fetchProductDetails();
      message.success("Gửi đánh giá thành công");
      return res;
    } else {
      message.error("Vui lòng nhập nội dung đánh giá");
    }
  };

  const handleCommentEnter = async (e) => {
    if (e.keyCode === 13) {
      if (isValidText) {
        const res = await ProductService.postComment(
          productDetails?._id,
          commentText,
          user?.access_token
        );
        setCommentText({ text: "", createAt: "" });
        fetchProductDetails();
        message.success("Gửi đánh giá thành công");
        return res;
      } else {
        message.error("Vui lòng nhập nội dung đánh giá");
      }
    }
  };

  const handleReplyComment = async () => {
    if (replyText.text) {
      const res = await ProductService.replyComment(
        productDetails?._id,
        replyText,
        user?.access_token
      );

      fetchProductDetails();
      message.success("Đã gửi câu trả lời");
      setReplyText({ text: "", createAt: "", commentId: "" });

      return res;
    } else {
      message.error("Vui lòng nhập nội dung.");
    }
  };

  const handleReplyClick = (commentId) => {
    if (!user.id) {
      message.error("Vui lòng đăng nhập để trả lời");
    } else {
      if (commentIdReplying === commentId) {
        setCommentIdReplying("");
      } else {
        setCommentIdReplying(commentId);
      }
    }
  };

  const handleReplyTheReplyClick = (commentId) => {
    setReplyId(commentId);
    if (!user.id) {
      message.error("Vui lòng đăng nhập để trả lời");
    } else {
      if (commentIdReplyingTheReplying === commentId) {
        setCommentIdReplyingTheReplying("");
      } else {
        setCommentIdReplyingTheReplying(commentId);
      }
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user.id) {
      message.error("Vui lòng đăng nhập để thực hiện");
    } else {
      const payload = {
        commentId,
        userId: user?.id,
      };
      setLoadingLike(true);
      const res = await ProductService.likeComment(
        productDetails?._id,
        payload,
        user?.access_token
      );
      if (res) {
        fetchProductDetails();
        setLoadingLike(false);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    const payload = {
      commentId: commentId,
      userId: user?.id,
    };
    const res = await ProductService.deleteComment(
      productDetails?._id,
      payload,
      user?.access_token
    );
    fetchProductDetails();
    if (res) {
      message.success("Đã xóa bình luận");
    }
    return res;
  };
  const commentArr = productDetails?.comments?.map((item) => {
    return item;
  });

  const replyArr = commentArr?.map((item) => {
    return item?.reply;
  });

  const onChangeComment = (e) => {
    setCommentText({
      text: e.target.value,
      createAt: new Date(),
    });
  };

  const onChangeReply = (e) => {
    setReplyText({
      text: e.target.value,
      createAt: new Date(),
      commentId: commentIdReplying,
    });
  };

  const handleTimeAgo = (createTime) => {
    const timeAgo = Math.floor(
      (new Date().getTime() - new Date(createTime).getTime()) / (1000 * 60)
    );
    return timeAgo;
  };

  const handleTimeJoin = (createTime) => {
    const timeJoin = Math.floor(
      (new Date().getTime() - new Date(createTime).getTime()) / (1000 * 60)
    );
    return timeJoin;
  };

  const timeAgoRender = (timeAgo) => {
    const minutesInHour = 60;
    const minutesInDay = 1440; // 60 * 24
    const minutesInMonth = 43200; // 60 * 24 * 30
    const minutesInYear = 525600; // 60 * 24 * 365

    if (timeAgo >= minutesInYear) {
      return `${Math.floor(timeAgo / minutesInYear)} năm trước`;
    } else if (timeAgo >= minutesInMonth) {
      return `${Math.floor(timeAgo / minutesInMonth)} tháng trước`;
    } else if (timeAgo >= minutesInDay) {
      return `${Math.floor(timeAgo / minutesInDay)} ngày trước`;
    } else if (timeAgo >= minutesInHour) {
      return `${Math.floor(timeAgo / minutesInHour)} giờ trước`;
    } else {
      return timeAgo === 0 ? "Vừa xong" : `${timeAgo} phút trước`;
    }
  };

  const timeJoinRender = (timeJoin) => {
    const minutesInHour = 60;
    const minutesInDay = 1440; // 60 * 24
    const minutesInMonth = 43200; // 60 * 24 * 30
    const minutesInYear = 525600; // 60 * 24 * 365

    if (timeJoin >= minutesInYear) {
      return `Đã tham gia ${Math.floor(timeJoin / minutesInYear)} năm`;
    } else if (timeJoin >= minutesInMonth) {
      return `Đã tham gia ${Math.floor(timeJoin / minutesInMonth)} tháng`;
    } else if (timeJoin >= minutesInDay) {
      return `Đã tham gia ${Math.floor(timeJoin / minutesInDay)} ngày`;
    } else if (timeJoin >= minutesInHour) {
      return `Đã tham gia ${Math.floor(timeJoin / minutesInHour)} giờ`;
    } else {
      return `Đã tham gia ${timeJoin} phút`;
    }
  };

  const items = [
    {
      label: "Xóa bình luận",
      key: "1",
    },
  ];

  const handleMenuClick = (e, commentId) => {
    if (e.key == "1") {
      handleDeleteComment(commentId);
    } else {
      return false;
    }
  };

  const handleUserClick = (user) => {
    setIsOpenModal(true);
    setUserLikeInfo(user);
  };

  const menuProps = {
    items,
    onClick: (e) => handleMenuClick(e, commentId),
  };

  return (
    <div className="max-w-7xl rounded-xl m-auto custom-modal">
      <ModalComponent
        footer={null}
        title="Được thích bởi"
        open={isOpenModal}
        onCancel={handleCancel}
        // onOk={handleUpdateInfoUser}
        className="custom-modal"
      >
        {Array.isArray(userLikeInfo) &&
          userLikeInfo?.map((user) => {
            return (
              <div key={user?.id} className="flex items-center gap-4 mb-3">
                <div className="relative">
                  <div>
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  </div>

                  <div className="absolute -right-1 -bottom-1">
                    <img src={likeSvg} alt="like" width={18} height={18} />
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-base font-medium">{user.name}</span>
                  {user.isAdmin && (
                    <Tooltip title="Người sáng lập">
                      <CheckCircleFilled className="text-blue-500" />
                    </Tooltip>
                  )}
                </div>
              </div>
            );
          })}
      </ModalComponent>
      <p className="text-base md:text-2xl px-4 md:px-0 mb-3 font-medium">
        {" "}
        Bình luận, hỏi đáp:
      </p>
      <Loading isLoading={loadingLike}>
        <div className="comment-list px-4 md:px-0 scrollbar-hide overflow-x-hidden overflow-y-auto max-h-96 relative">
          {productDetails?.comments?.map((comment) => {
            const isLikedByCurrentUser = comment.likes.some(
              (like) => like?._id === user.id
            );

            return (
              <>
                {comment?.postedBy && (
                  <div key={comment?._id}>
                    <div
                      className="comment-item w-full md:w-6/12 bg-white md:p-4 p-2 mb-1 rounded-xl relative"
                      onClick={() => setCommentId(comment?._id)}
                    >
                      <div className="user-top gap-5 flex justify-between items-center mb-1 md:mb-2">
                        <div
                          className="user-info"
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                          }}
                        >
                          <div className="user-img">
                            <img
                              className="w-8 h-8 md:w-12 md:h-12 rounded-full object-cover"
                              src={
                                comment?.postedBy?.avatar
                                  ? comment?.postedBy?.avatar
                                  : default_avatar
                              }
                              alt="user-img"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 w-full">
                              <h1 className="user-name m-0 text-sm md:text-base one-line max-w-full">
                                {comment?.postedBy?.name}
                              </h1>
                              {comment?.postedBy?.isAdmin && (
                                <Tooltip title="Người sáng lập">
                                  <CheckCircleFilled className="text-blue-500" />
                                </Tooltip>
                              )}
                            </div>
                            <h2 className="text-xs md:text-sm font-normal m-0">
                              {timeJoinRender(
                                handleTimeJoin(comment?.postedBy?.createdAt)
                              )}
                            </h2>
                          </div>
                        </div>

                        {user?.id === comment?.postedBy?._id && (
                          <div>
                            <Dropdown.Button menu={menuProps}></Dropdown.Button>
                          </div>
                        )}
                      </div>
                      <div className="user-bottom">
                        <p className="text-sm md:text-base md:pl-[58px] pl-[42px] mb-0">
                          {comment?.text}
                        </p>
                      </div>

                      <div
                        className="absolute -right-1 -bottom-1"
                        onClick={() => handleUserClick(comment?.likes)}
                      >
                        {comment.likes.length > 0 && (
                          <div className="flex gap-1 items-center p-[1px] rounded-xl bg-slate-200 cursor-pointer">
                            <div>
                              <img
                                src={likeSvg}
                                alt="like-icon"
                                width={18}
                                height={18}
                              />
                            </div>
                            {comment.likes.length > 1 && (
                              <div>{comment.likes.length}</div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* {comment.likes.length > 1 && (
                    <div className="absolute -right-1 -bottom-1">
                      <img src={likeSvg} alt="" width={18} height={18} />
                    </div>
                  )} */}
                    </div>

                    <div className="md:pl-[74px] pl-[50px] w-full md:w-1/2 flex justify-between items-center">
                      <div className="flex gap-3">
                        <span
                          className="cursor-pointer"
                          onClick={() => handleReplyClick(comment?._id)}
                        >
                          Trả lời
                        </span>

                        <span
                          className={
                            isLikedByCurrentUser
                              ? "text-blue-500 cursor-pointer"
                              : "" + "cursor-pointer"
                          }
                          onClick={() => handleLikeComment(comment?._id)}
                        >
                          {isLikedByCurrentUser ? "Đã thích" : "Thích"}
                        </span>
                      </div>
                      <div className="user-time flex-auto flex gap-2 md:gap-3 justify-end">
                        <span className="flex items-center text-xs md:text-base">
                          {comment?.createAt && (
                            <FieldTimeOutlined style={{ marginRight: "5px" }} />
                          )}
                          {timeAgoRender(handleTimeAgo(comment?.createAt))}
                        </span>
                        {/* <span className="text-xs md:text-base">
                        {new Date(comment?.createAt).toLocaleDateString()}
                      </span> */}
                      </div>
                    </div>

                    <div className="pl-[50px] md:pl-[74px] ">
                      {Array.isArray(comment.reply) &&
                        comment?.reply?.map((reply) => {
                          const isLikedReplyByCurrentUser = reply.likes.some(
                            (like) => like._id === user.id
                          );
                          return (
                            <>
                              {reply?.postedBy && (
                                <div
                                  key={reply?._id}
                                  className="w-full md:w-1/2"
                                >
                                  <div
                                    className="comment-item w-full bg-white md:p-4 p-2 mb-1 rounded-xl relative"
                                    onClick={() => setCommentId(reply?._id)}
                                  >
                                    <div className="user-top gap-5 flex justify-between items-center mb-1 md:mb-2">
                                      <div
                                        className="user-info"
                                        style={{
                                          display: "flex",
                                          gap: 10,
                                          alignItems: "center",
                                        }}
                                      >
                                        <div className="user-img">
                                          <img
                                            className="w-8 h-8 md:w-12 md:h-12 rounded-full object-cover"
                                            src={
                                              reply?.postedBy?.avatar
                                                ? reply?.postedBy?.avatar
                                                : default_avatar
                                            }
                                            alt="user-img"
                                          />
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2 w-full">
                                            <h1 className="user-name m-0 text-sm md:text-base one-line max-w-full">
                                              {reply?.postedBy?.name}
                                            </h1>
                                            {reply?.postedBy?.isAdmin && (
                                              <Tooltip title="Người sáng lập">
                                                <CheckCircleFilled className="text-blue-500" />
                                              </Tooltip>
                                            )}
                                          </div>
                                          <h2 className="text-xs md:text-sm font-normal m-0">
                                            {timeJoinRender(
                                              handleTimeJoin(
                                                reply?.postedBy?.createdAt
                                              )
                                            )}
                                          </h2>
                                        </div>
                                      </div>
                                      {user?.id === reply?.postedBy?._id && (
                                        <div>
                                          <Dropdown.Button
                                            menu={menuProps}
                                          ></Dropdown.Button>
                                        </div>
                                      )}
                                    </div>
                                    <div className="user-bottom">
                                      <p className="text-sm md:text-base pl-[42px] md:pl-[58px] mb-0">
                                        {reply?.text}
                                      </p>
                                    </div>

                                    {reply.likes.length > 0 && (
                                      <div
                                        className="absolute -right-1 -bottom-1"
                                        onClick={() =>
                                          handleUserClick(reply?.likes)
                                        }
                                      >
                                        <div className="flex gap-1 items-center p-[1px] rounded-xl bg-slate-200 cursor-pointer">
                                          <div>
                                            <img
                                              src={likeSvg}
                                              alt="like-icon"
                                              width={18}
                                              height={18}
                                            />
                                          </div>
                                          {reply.likes.length > 1 && (
                                            <div>{reply.likes.length}</div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="pl-[50px] md:pl-[74px] flex justify-between items-center">
                                    <div className="flex gap-3">
                                      <span
                                        className="cursor-pointer"
                                        onClick={() =>
                                          handleReplyTheReplyClick(reply?._id)
                                        }
                                      >
                                        Trả lời
                                      </span>
                                      <span
                                        className={
                                          isLikedReplyByCurrentUser
                                            ? "text-blue-500 cursor-pointer"
                                            : "" + "cursor-pointer"
                                        }
                                        onClick={() =>
                                          handleLikeComment(reply?._id)
                                        }
                                      >
                                        {isLikedReplyByCurrentUser
                                          ? "Đã thích"
                                          : "Thích"}
                                      </span>
                                    </div>
                                    <div className="user-time flex-auto flex gap-2 md:gap-3 justify-end">
                                      <span className="flex items-center text-xs md:text-base">
                                        {reply?.createAt && (
                                          <FieldTimeOutlined
                                            style={{ marginRight: "5px" }}
                                          />
                                        )}
                                        {timeAgoRender(
                                          handleTimeAgo(reply?.createAt)
                                        )}
                                      </span>
                                      {/* <span className="text-xs md:text-base">
                      {new Date(comment?.createAt).toLocaleDateString()}
                    </span> */}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        })}
                      {commentIdReplying === comment?._id && (
                        <div className="w-full md:w-1/2 mb-4 mt-1">
                          <div className="md:mb-0 gap-2 md:p-5 p-2 md:h-28 h-20 rounded-xl bg-white">
                            <div className="flex gap-4 items-center h-full">
                              <img
                                src={user?.avatar || default_avatar}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                                alt="user-avatar"
                              />
                              <textarea
                                className="mt-3 w-full border-none outline-none resize-none"
                                placeholder="Viết câu trả lời..."
                                value={replyText?.text}
                                type="text"
                                onChange={onChangeReply}
                              />
                              <SendOutlined
                                onClick={handleReplyComment}
                                className={
                                  replyText?.text !== ""
                                    ? "text-blue-600"
                                    : "text-zinc-500"
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            );
          })}
          {false && (
            <div className="mb-[20%] md:mb-0 gap-2 md:p-5 p-2 md:h-28 h-20 rounded-xl bg-white absolute z-20">
              <div className="flex gap-4 items-center h-full">
                <img
                  src={user?.avatar || default_avatar}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  alt="user-avatar"
                />
                <textarea
                  className="mt-3 w-full md:h-20 h-10 border-none outline-none resize-none"
                  placeholder={"Viết bình luận, hỏi đáp..."}
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
          )}
        </div>
      </Loading>
      <div className="w-full md:w-1/2 flex flex-col gap-2 p-4 md:pb-4 md:px-0">
        <div className="gap-2 md:p-5 p-2 md:h-28 h-20 rounded-xl bg-white">
          <div className="flex gap-4 items-center h-full">
            <img
              src={user?.avatar || default_avatar}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              alt="user-avatar"
            />
            <textarea
              className="mt-3 w-full border-none outline-none resize-none"
              placeholder={"Viết bình luận, hỏi đáp..."}
              value={commentText?.text}
              type="text"
              onChange={onChangeComment}
              onKeyDown={handleCommentEnter}
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

export default React.memo(Comment);
