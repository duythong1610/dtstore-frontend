import { useQuery } from "@tanstack/react-query";
import React from "react";
import * as ProductService from "../../services/ProductService";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Comment = ({ idProduct }) => {
  const user = useSelector((state) => state.user);
  console.log({ user });
  const [comment, setComment] = useState({ text: "" });
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
      comment,
      user?.access_token
    );
    fetchProductDetails();
    return res;
  };
  console.log({ comment });
  const onChangeComment = (e) => {
    setComment({ text: e.target.value });
  };
  return (
    <div>
      <div>
        {productDetails?.comments?.map((comment) => {
          return (
            <>
              <div style={{ padding: "32px 48px", display: "flex" }}>
                <div style={{ flexBasis: "335px", flexShrink: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      WebkitBoxAlign: "center",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    <img
                      src={comment?.postedBy?.avatar}
                      alt=""
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                    />
                    <h1> {comment?.postedBy?.name}</h1>
                  </div>
                </div>
                <div>
                  <h2>{comment?.text}</h2>
                </div>
              </div>
            </>
          );
        })}
      </div>
      <div>
        Viết comment
        <input type="text" onChange={onChangeComment} />
        <button onClick={handleComment}>commnet</button>
      </div>
    </div>
  );
};

export default Comment;
