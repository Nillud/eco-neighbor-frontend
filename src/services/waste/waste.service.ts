import { $api } from '@/lib/api/axios'
import { Option } from '@/types/option.types'

import { IWaste } from './waste.types'

class WasteService {
  private WASTE = '/waste'

  async getAll(): Promise<Option[]> {
    const result = await $api.get<IWaste[]>(`${this.WASTE}`)
    return result.data.map(el => ({ label: el.name, value: el.slug }))
  }
}

export const wasteService = new WasteService()
