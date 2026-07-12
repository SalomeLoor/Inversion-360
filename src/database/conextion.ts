import axios from "axios";

const urrl = "http://localhost:3000/api"; // Cambia esto a la URL de tu servidor backend

export const connection = axios.create({
  baseURL: urrl,
})