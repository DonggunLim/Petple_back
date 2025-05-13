const { createError, AppError } = require('../../utils/error');
const promisePool = require('../../config/mysql.config');

class PetService {
  async deletePet(id) {
    const sql = `
        DELETE FROM
            pets
        WHERE 
            id = ?
    `;
    try {
      const [result] = await promisePool.query(sql, [id]);
      if (result.affectedRows === 0) {
        throw createError(
          404,
          `[404 PetService.deletePet] 해당 ID의 반려동물이 존재하지 않습니다.`,
        );
      }
      return result;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw createError(500, `[500 PetService.deletePet] ${error.message}`);
    }
  }

  async updatePet({ id, age, breed, name, image }) {
    const sql = `
        UPDATE
            pets
        SET
            age = ?,
            breed = ?,
            name = ?,
            image = ?
        WHERE
            id = ?
    `;
    try {
      const [result] = await promisePool.query(sql, [
        age,
        breed,
        name,
        image,
        id,
      ]);
      if (result.affectedRows === 0) {
        throw createError(
          404,
          `[404 PetService.updatePet] 해당 ID의 반려동물이 존재하지 않습니다.`,
        );
      }
      return result;
    } catch (error) {
      throw createError(500, `[500 PetService.updatePet] ${error.message}`);
    }
  }
}

module.exports = new PetService();
