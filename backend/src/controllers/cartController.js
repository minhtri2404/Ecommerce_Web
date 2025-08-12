const Cart = require('../models/cartModel')
const Product = require('../models/productModel');
const User = require('../models/userModel');

class CartController {
    // Thêm sản phẩm vào giỏ hàng
    addToCart = async(req, res) => {
        try {
            const userId = req.user._id; // Lấy user(_id) từ middleware xác thực token
            const {productId, quantity = 1, size, color} = req.body
            console.log('req.body:', req.body);

            // Kiểm tra người dùng đã tồn tại không
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({success: false, error: 'Người dùng không tồn tại'});
            }

            // Kiểm tra sản phẩm có tồn tại không
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({success: false, error: 'Sản phẩm không tồn tại'});
            }

            // Nếu quantity không phải số hoặc bị thiếu thì mặc định là 1
            const qty = Math.max(1, Number(quantity) || 1);
            // Kiểm tra tồn kho
            if (qty > product.quantity) {
                return res.status(400).json({ success: false, error: `Chỉ còn ${product.quantity} sản phẩm trong kho` });
            }

            // Lấy giỏ hàng của người dùng (nếu có)
            let cart = await Cart.findOne({user: userId})
            if (!cart) {
                // Tạo giỏ hàng mới nếu chưa có
                cart = new Cart({
                    user: userId,
                    items: [{
                        product: productId,
                        quantity: qty,
                        size: size || null,
                        color: color || null,
                        price: product.price,
                        image: product.images[0] || null
                    }]
                })
            } else{
                // Đã có giỏ hàng, kiểm tra sản phẩm đã có trong giỏ hàng chưa
                const existingItem = cart.items.find(
                    item => item.product.toString() === productId &&
                            item.size === size && 
                            item.color === color
                );
                if (existingItem) {
                    // Nếu có, tăng số lượng sản phẩm
                    const newQty = existingItem.quantity + qty;
                    if (newQty > product.quantity) {
                        return res.status(400).json({ success: false, error: `Không thể thêm quá ${product.quantity} sản phẩm` });
                    }
                    existingItem.quantity = newQty;
                } else {
                    // Nếu không, thêm sản phẩm mới vào giỏ hàng
                    cart.items.push({
                        product: productId,
                        quantity: qty,
                        size: size || null,
                        color: color || null,
                        price: product.price,
                        image: product.images[0] || null
                    });
                }
            }
            
            // Lưu giỏ hàng
            await cart.save();
            return res.status(200).json({success: true, message: 'Thêm sản phẩm vào giỏ hàng thành công', cart});

        } catch (error) {
            return res.status(500).json({success: false, error: 'Server error'})
        }
    }
    
    // Hiển thị sản phẩm trong giỏ hàng của người dùng
    getCart = async(req, res) => {
        try {
            const userId = req.user._id; // Lấy user(_id) từ middleware xác thực token

            // Tìm giỏ hàng của người dùng
            const cart = await Cart.findOne({user: userId}).populate('items.product', 'name price images');

            if (!cart) {
                return res.status(404).json({success: false, error: 'Giỏ hàng không tồn tại'});
            }

            return res.status(200).json({success: true, cart});
        } catch (error) {
            return res.status(500).json({success: false, error: 'Server error'});
        }
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    updateCart = async (req, res) => {
        try {
            const userId = req.user._id; 
            const { productId, quantity, size, color } = req.body;

            //Tìm giỏ hàng của người dùng theo id của user và populate cả quantity để kiểm tra tồn kho
            const cart = await Cart.findOne({ user: userId })
                .populate('items.product', 'name price images quantity');

            if (!cart) {
                return res.status(404).json({ success: false, error: 'Giỏ hàng không tồn tại' });
            }

            // Tìm sản phẩm trong giỏ hàng
            const itemIndex = cart.items.findIndex(
                item => item.product._id.toString() === productId &&
                        item.size === size &&
                        item.color === color
            );

            // Kiểm tra sản phẩm có trong giỏ hàng không
            if (itemIndex === -1) {
                return res.status(404).json({ success: false, error: 'Sản phẩm không có trong giỏ hàng' });
            }

            const productStock = cart.items[itemIndex].product.quantity;

            // Nếu quantity <= 0 => Xóa sản phẩm khỏi giỏ
            if (quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            } 
            // Nếu quantity vượt tồn kho => Trả lỗi
            else if (quantity > productStock) {
                return res.status(400).json({ success: false, error: `Chỉ còn ${productStock} sản phẩm trong kho` });
            } 
            // Ngược lại => Cập nhật số lượng
            else {
                cart.items[itemIndex].quantity = quantity;
            }

            await cart.save();
            return res.status(200).json({ success: true, message: 'Cập nhật giỏ hàng thành công', cart });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: 'Server error' });
        }
    };
}

module.exports = new CartController();