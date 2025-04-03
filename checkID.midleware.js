// Middleware kiểm tra ID
export function checkID(req, res, next) {
    console.log("Middleware checkId đang chạy...");
    let id = req.params.id;
    id = parseInt(id);
    console.log(id);
    
    if (isNaN(id)) {
        return res.status(400).send({ message: "It's must be a number" });
    }
    next();
}