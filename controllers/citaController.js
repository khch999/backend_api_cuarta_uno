/**
 * Controlador de Mascotas
 * @description Maneja las operaciones HTTP de creación, update y lectura de citas
 */
const express = require('express');
const Cita = require('../models/citas');
const Pet = require('../models/mascotas');
class CitaController{
    static async getAvailableHours(req, res){
        try {
            const {fecha} = req.query;
            if(!fecha){
                return res.status(400).json
                ({
                    success: true,
                    message:'Fecha requerida'
                });
            }
        const horasBase = [];

        for (let h = 0; h < 24; h++) {
            const hora = `${h.toString().padStart(2, "0")}:00`;
            if (Cita.isValidSchedule(fecha, hora)) {
                horasBase.push(hora);
            }            
        }
        const horasOcupadas = await Cita.getHoursByDate(fecha);
        const disponibles = horasBase.filter(
            h => !horasOcupadas.includes(h)
        );
        res.json(disponibles);
        }catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Error obtenindo horas disponibles."
            }); 
        }
    }

    //Usuario crea cuenta
    static async createDate(req, res){
        try {
            if (req.user.rol != 'owner') {
                return res.status(403).json({
                    success: false,
                    message: 'Solo los propietarios de la mascota pueden solicitar cita'
                });
            }
            const propietario_id = req.user.userId;
            const {fecha, hora, motivo, mascota_id} = req.body;
            const mascota = await Pet.findById(mascota_id);
            console.log("User ID del token:", propietario_id);
            console.log("Mascota propietario_id:", mascota?.propietario_id);
            //verificar que exista la mascota
            if (!mascota) {
                return res.status(404).json({
                    success: false,
                    message: 'Mascota no encontrada.'
                });
            }
            //verificar que la mascota sea del propietario  
            if (mascota.id_propietario != propietario_id) {
                return res.status(403).json({
                    success: false,
                    message: 'Solo puedes reservar citas para tus propias mascotas.'
                });
            }
            const newDate = await Cita.create({fecha, hora, motivo, mascota_id, propietario_id});
            res.status(201).json({
                success: true,
                message: 'Cita creada correctamente.',
                data: newDate
            });
        } catch (error) {
            if (error.message.includes('Horario')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            if (error.message.includes('existe una cita')) {
                return res.status(409).json({
                    success: false,
                    message: error.message
                }); 
            }
            if (error.message.includes('fechas u horas pasadas')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error al crear cita.'
            });
        }
    }
    //ver las citas propias de un propietario, rol owner
    static async getMyDates(req, res){
        try {
            if (req.user.rol !== 'owner') {
                return res.status(403).json({
                    success: false,
                    message: 'Acceso denegado'
                });
            }
            const citas = await Cita.findByUser(req.user.userId);
            res.status(200).json({
                success: true,
                data: citas
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener citas.'
            });
        }
    }
    //ver todas las citas, rol 'admin' sitio web 
    static async getAllDates(req, res){
        try {
            // if (req.user.rol !== 'admin') {
            //     return res.status(403).json({
            //         success: false,
            //         message: 'Acceso denegado.'
            //     });
            // }
            const citas = await Cita.findAll();
            res.status(200).json({
                success: true,
                data: citas
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener citas.'
            });
        }
    }
    //cancelar cita  //de momento los 2 roles pueden cancelar
    static async cancelDate(req, res){
        try {
            const {id} = req.params;
            const cita = await Cita.findById(id);
            if (!cita) {
                return res.status(404).json({
                    success: false,
                    message: 'Cita no encontrada.'
                });
            }
            //verefica si la cita tiene estado cancelada ya 
            if (cita.estado === 'cancelada') {
                return res.status(400).json({
                    success: false,
                    message: 'La cita ya está cancelada.'
                });
            }
            //'owner' solo puede cambiar citas de sus mascotas
            if (req.user.rol === 'owner' 
                && cita.propietario_id !== req.user.userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Solo puedes cancelar las citas de tus mascotas.'
                });
            }
            await Cita.cancel(id);
            res.status(200).json({
                success: true,
                message: 'Cita cancelada.'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al cancelar cita.'
            });
        }

    } 
    //cambiar estado //solo admin
    static async updateStatusDate(req, res){
        try {
            if (req.user.rol !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Acción no autorizada.'
                });
            }
            const {id} = req.params;
            const {estado} = req.body;

            const validStatus = ['pendiente', 'confirmada', 'cancelada'];
            if (!validStatus.includes(estado)) {
                return res.status(400).json({
                    success: false,
                    message: 'Estado inválido.'
                });                
                }
                const cita = await Cita.findById(id);
                if (!cita) {
                    return res.status(404).json({
                        success: false,
                        message: 'Cita no encontrada.'
                    });
            }
            if (cita.estado === estado) {
                return res.status(400).json({
                    success: false,
                    message: `La cita ya está ${estado}.`
                });
            }
            await Cita.update(id, estado);
            return res.status(200).json({
                success: true,
                message: 'Estado de la cita actualizado correctamente.'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al actualizar estado.'
            });
        }
    }
}
module.exports = CitaController;
