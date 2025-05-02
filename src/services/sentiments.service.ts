import axios from 'axios'

const API_URL = 'http://localhost:3000/api/admin'

export interface SubSentiment {
  id: number
  name: string
  description: string | null
  keywords: string[]
  mainSentimentId: number
  createdAt: string
  updatedAt: string
}

export interface MainSentiment {
  id: number
  name: string
  description: string | null
  keywords: string[]
  subSentiments: SubSentiment[]
  createdAt: string
  updatedAt: string
}

export const sentimentsService = {
  // Buscar todos os sentimentos
  async getAllSentiments(): Promise<MainSentiment[]> {
    const response = await axios.get(`${API_URL}/sentiments`)
    return response.data
  },

  // Criar sentimento principal
  async createMainSentiment(data: { name: string; description?: string; keywords?: string[] }): Promise<MainSentiment> {
    const response = await axios.post(`${API_URL}/sentiments`, data)
    return response.data
  },

  // Atualizar sentimento principal
  async updateMainSentiment(id: number, data: { name?: string; description?: string; keywords?: string[] }): Promise<MainSentiment> {
    const response = await axios.put(`${API_URL}/sentiments/${id}`, data)
    return response.data
  },

  // Excluir sentimento principal
  async deleteMainSentiment(id: number): Promise<void> {
    await axios.delete(`${API_URL}/sentiments/${id}`)
  },

  // Criar sub-sentimento
  async createSubSentiment(data: { 
    name: string
    description?: string
    keywords?: string[]
    mainSentimentId: number 
  }): Promise<SubSentiment> {
    const response = await axios.post(`${API_URL}/sub-sentiments`, data)
    return response.data
  },

  // Atualizar sub-sentimento
  async updateSubSentiment(id: number, data: {
    name?: string
    description?: string
    keywords?: string[]
    mainSentimentId?: number
  }): Promise<SubSentiment> {
    const response = await axios.put(`${API_URL}/sub-sentiments/${id}`, data)
    return response.data
  },

  // Excluir sub-sentimento
  async deleteSubSentiment(id: number): Promise<void> {
    await axios.delete(`${API_URL}/sub-sentiments/${id}`)
  }
} 