import React from "react";
import {
  Box,
  HStack,
  Grid,
  Tag,
  VStack,
  Image,
  Text,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Button,
  Select,
  border,
  useToast,
} from "@chakra-ui/react";
import { TbTruckReturn } from "react-icons/tb";
import { MdArrowDropDown } from "react-icons/md";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

export const CartProductItem = ({
  id,
  quantity,
  brand_name,
  name,
  price,
  sizes,
  customer_rating,
  product_details,
  images,
  handleCartProducts,
  setTotalAmount,
  setTotalMRP,
  setTotalMRPDiscount,
  currentSize,
}) => {
  const { mrp, discount, sp } = price;
  // console.log(mrp,discount,sp);
  const [currentSizeShow, setCurrentSize] = useState(currentSize || sizes[0]);
  const [currentQty, setCurrentQty] = useState(1);
  const toast = useToast();

  const REACT_APP_MYNTRA_API = "https://myntra-api-mfh1.onrender.com/";

  //   take care of size
  const handleSize = (e) => {
    axios({
      method: "patch",
      url: REACT_APP_MYNTRA_API + "cart/" + id,
      data: {
        currentSize: e.target.value,
      },
    }).then(({ data }) => {
      setCurrentSize(data.currentSize);
    });
  };

  //   take care of quantity
  const handleQty = (e) => {
    e = e.target.value;
    setTotalMRP((prev) => prev + mrp * (e - currentQty));
    // console.log
    setTotalMRPDiscount(
      (prev) => prev + mrp * (e - currentQty) - sp * (e - currentQty)
    );
    setTotalAmount((prev) => prev + sp * (e - currentQty));
    setCurrentQty(e);
  };
  //   take care of price
  useEffect(() => {
    setTotalMRP((prev) => prev + mrp);
    setTotalMRPDiscount((prev) => prev + mrp - sp);
    setTotalAmount((prev) => prev + sp);
  }, []);

  //   take care of delete

  const handleDelete = () => {
    axios({
      method: "delete",
      url: REACT_APP_MYNTRA_API + `cart/${id}`,
    }).then((res) => {
      handleCartProducts();
      setTotalMRP((prev) => prev - mrp * currentQty);
      setTotalAmount((prev) => prev - sp * currentQty);
      setTotalMRPDiscount((prev) => prev - currentQty * (mrp - sp));
      toast({
        title: "product successfully deleted.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    });
  };

  return (
    <>
      <Grid
        templateColumns={"1fr 3fr 20px"}
        textAlign="left"
        gap="10px"
        w="full"
        border={"1px solid #ebebed"}
        borderRadius="5px"
      >
        <Box p={"15px"}>
          <Image src={images[0]} alt=""></Image>
        </Box>
        <Box w={"full"} py={"15px"}>
          <VStack w={"full"} align="flex-start">
            <Text fontWeight={"bold"} fontSize="14px" color="#282c3f">
              {brand_name}
            </Text>
            <Text
              fontSize={"14px"}
              color="#282c3f"
              fontWeight={400}
              isTruncated
              w={"400px"}
            >
              {name}
            </Text>
            <HStack>
              <HStack borderRadius={"5px"} bgcolor={"#f5f5f6"}>
                <Text
                  pl={1}
                  color={"#282c3f"}
                  fontSize={"14px"}
                  fontWeight={"bold"}
                >
                  Size:
                </Text>
                <Select
                  value={currentSizeShow}
                  onChange={handleSize}
                  icon={<MdArrowDropDown />}
                  size={"sm"}
                  variant={"unstyled"}
                  fontWeight="500"
                  color={"#282c3f"}
                >
                  {sizes.map((el) => {
                    return (
                      <option fontWeight="500" key={el} value={el}>
                        {el}
                      </option>
                    );
                  })}
                </Select>
              </HStack>
              <HStack borderRadius={"5px"} bgColor={"#f5f5f6"}>
                <Text
                  pl={1}
                  color={"#282c3f"}
                  fontSize={"14px"}
                  fontWeight={"bold"}
                >
                  Qty:
                </Text>
                <Select
                  color={"#282c3f"}
                  icon={<MdArrowDropDown />}
                  size={"sm"}
                  p={0}
                  m={0}
                  variant={"unstyled"}
                  value={currentQty}
                  onChange={handleQty}
                  fontWeight="500"
                >
                  <option fontWeight="500" value={1}>
                    1
                  </option>
                  <option fontWeight="500" value={2}>
                    2
                  </option>
                  <option fontWeight="500" value={3}>
                    3
                  </option>
                  <option fontWeight="500" value={4}>
                    4
                  </option>
                  <option fontWeight="500" value={5}>
                    5
                  </option>
                </Select>
              </HStack>
            </HStack>
            {/* price making  */}
            <HStack fontSize={"14px"}>
              <Text color={"#282c3f"} fontWeight={"bold"}>
                ₹{sp * currentQty}
              </Text>
              <Text color={"#282c3f"} fontWeight={400} textDecor="line-through">
                ₹{mrp * currentQty}
              </Text>
              <Text color={"#f16565"} fontWeight={400}>
                {discount}% OFF
              </Text>
            </HStack>
            <HStack fontSize={"12px"} spacing={1}>
              <Icon fontSize={"16px"} color="282c3f" as={TbTruckReturn} />
              <Text fontWeight={"bold"} color="282c3f">
                30 days
              </Text>
              <Text color="282c3f">return available</Text>
            </HStack>
          </VStack>
        </Box>
        <Box
          position={"relative"}
          top={"3px"}
          right={"5px"}
          fontSize={"20px"}
          color="282c3f"
          cursor={"pointer"}
          onClick={() => handleDelete(id)}
        >
          &#x2715;
        </Box>
      </Grid>
    </>
  );
};
