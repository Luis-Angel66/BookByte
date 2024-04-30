import pool from '../config/database.js';
import util from 'util';
import passport from '../config/passport.js';

function getData(req, res, next) {
    if(req.isAuthenticated()){
        const idCliente = req.user.user_id; 
        console.log(idCliente);
        try {
            const query = `
                SELECT c.idCliente, c.idLibro, l.book_name, l.book_price
                FROM carrito c
                INNER JOIN books l ON c.idLibro = l.book_id
                WHERE c.idCliente = ?
            `;
            pool.query(query, [idCliente], (error, results) =>{
                if (error) {
                    console.log(error);
                }
                if(results.length > 0){
                    req.carrito = results;
                }else{
                    req.carrito = null;
                }
                return next();
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener datos del carrito');
        }    
    }else{
        req.carrito = null;
        return next();
        
    }


}

async function carritoo(req, res) {
    const { id } = req.params;
    const idCliente = req.user.user_id;
    const query = 'INSERT INTO carrito (idCliente, idLibro) VALUES (?,?)';
    try {
        pool.query(query, [idCliente, id], (error, results) =>{
            if(error){
                console.log(error);
            }
            res.redirect('/');
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al añadir al carrito');
    }
}

export default { getData, carritoo };
