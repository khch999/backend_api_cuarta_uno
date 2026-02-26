const {pool} = require('../config/database');
class Cita{
    //validar horario: LUNES A VIERNES DE 9A.M A 16P.M.
    static isValidSchedule(fecha, hora) {
        const date = new Date(fecha);
        const day = date.getDay();
        
        if (day === 0 || day == 6) {
            return false;
        }
        const hour = parseInt(hora.split(':')[0]);
        return hour >= 9 && hour < 16;
    }
    //valida que no sea una fecha pasada
    static isValidDay(fecha, hora){
        const now = new Date();
        const  dayDateTime = new Date(`${fecha}T${hora}:00`);
        return dayDateTime > now;
    }
    //verificar que la hora no este agendada
    static async getHoursByDate(fecha){
        const [rows] = await pool.execute(
            `SELECT hora FROM citas WHERE fecha = ?`,
            [fecha]
        );
        return rows.map(r => r.hora.slice(0,5));
    }

    //crear cita
    static async create(datesData){
        try {
            const {fecha, hora, motivo, mascota_id, propietario_id} = datesData;
            //validamos horario
            if (!this.isValidSchedule(fecha, hora)) {
                throw new Error('Horario no permitido. Lunes a viernes de 9a.m. a 4p.m.');
            }
            if (!this.isValidDay(fecha, hora)) {
                throw new Error('No se pueden agendar citas en fechas u horas pasadas.')
            }
            const [result] = await pool.execute(
                `INSERT INTO citas (fecha, hora, motivo, mascota_id, propietario_id)
                VALUES (?, ?, ?, ?, ?)`,
                [fecha, hora, motivo, mascota_id, propietario_id]
            );
            return await this.findById(result.insertId);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error("Ya existe una cita a esa hora.");
            }
            throw error;
        }
    }
    //obtener cita por id
    static async findById(id){ 
        try {
            const [rows] = await pool.execute(
            `SELECT * FROM vista_citas_detalle WHERE id = ?`,
            [id]
        );
        return rows[0];
        } catch (error) {
            console.log("Error en Cita.findBy Id")
            throw new Error("Error al verificar cita id");
        }
        
    }
    //obtener todas las citas
    static async findAll(){
        try {
            const [rows] = await pool.execute(
            `SELECT * FROM vista_citas_detalle ORDER BY fecha ASC, hora ASC`
        );
        return rows;
        } catch (error) {
            console.error("Error en Cita.findAll",error);
            // throw new Error("Error al obtener los datos de las citas.");
            throw error;
        }
        
    }
    //encontrar cita por usuario
    static async findByUser(userId){
        try {
            const [rows] = await pool.execute(
                `SELECT * FROM vista_citas_detalle
                WHERE propietario_id = ? ORDER BY fecha ASC, hora ASC`,
                [userId]
            );
            return rows;
        } catch (error) {
            console.error('Error en Cita.findByUser:', error);
            throw new Error('Error al obtener citas por dueño de la mascota.');
        }
    }
    //cancelar la cita
    static async cancel(id){
        try {
            const [result] = await pool.execute(
                `UPDATE citas SET estado = 'cancelada'
                WHERE id = ?`,
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error en Cita.cancel:', error);
            throw new Error('Error al intentar cancelar cita.');
        }
    }
    //editar estado de la cita 
    static async update(id, estado){
        try {
           const [result] = await pool.execute(
            `UPDATE citas SET estado = ? 
            WHERE id = ?`,
            [estado, id]
           );
           return result.affectedRows > 0; 
        } catch (error) {
            console.log('Error en Cita.update:', error);
            throw new Error('Error al intentar cambiar el estado de la cita.');
        }
    }
}
module.exports = Cita;