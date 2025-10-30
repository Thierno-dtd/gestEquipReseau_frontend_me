import { mockAuthAPI, mockInfrastructureAPI, mockModificationsAPI } from '@mockTest/services/mockService';
import * as realAuthAPI from './auth';
import * as realInfrastructureAPI from './infrastructure';
import * as realModificationsAPI from './modifications';

const USE_MOCK= import.meta.env.VITE_USE_MOCK === 'true';

// ✅ Basculer automatiquement entre mock et real
export const authAPI = USE_MOCK ? mockAuthAPI : realAuthAPI.authAPI;
export const infrastructureAPI = USE_MOCK ? mockInfrastructureAPI : realInfrastructureAPI.infrastructureAPI;
export const modificationsAPI = USE_MOCK ? mockModificationsAPI : realModificationsAPI.modificationsAPI;

// Log pour debug
console.log(`🔧 API Mode: ${USE_MOCK ? 'MOCK' : 'REAL'}`);