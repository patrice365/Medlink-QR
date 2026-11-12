import type { VisitSeed } from '../types/visit';

export const seedVisits: VisitSeed[] = [
{
  id: 'VS-J012',
  patientId: 'ML-24F0J1',
  submittedAt: '2026-10-08T10:42:00+08:00',
  status: 'Follow-up Required',
  clinical: {
    dateTime: '2026-10-08T10:15',
    physician: 'Dr. Liza M. Abrenica',
    chiefComplaint: 'Cough and colds for 3 days',
    presentIllness: 'Productive cough with clear phlegm, mild nasal congestion. Low-grade fever last night.',
    weight: '58', height: '168', bp: '110/70', hr: '92', rr: '20', temp: '37.9',
    physicalExam: { 'Gen. Status': 'Awake, ambulatory, not in distress', Throat: 'Mildly hyperemic', 'Chest & Lungs': 'Clear breath sounds' },
    assessment: 'Viral upper respiratory symptoms, no signs of pneumonia.',
    diagnosis: 'Acute upper respiratory infection',
    treatment: 'Paracetamol 500 mg every 4 hours as needed for fever. Increase oral fluids.',
    plan: 'Rest, return if difficulty breathing develops.',
    followUpDate: '2026-10-15',
    otherRemarks: 'Penicillin allergy noted — avoid penicillin-based antibiotics.'
  }
},
{
  id: 'VS-J011',
  patientId: 'ML-24F0J1',
  submittedAt: '2026-09-12T14:55:00+08:00',
  status: 'Completed',
  clinical: {
    dateTime: '2026-09-12T14:30',
    physician: 'Dr. Ramon P. Villareal',
    chiefComplaint: 'Headache after long reading hours',
    weight: '58', height: '168', bp: '115/75', hr: '78', rr: '16', temp: '36.8',
    assessment: 'Bilateral, band-like headache. No neurologic deficits.',
    diagnosis: 'Tension-type headache',
    treatment: 'Ibuprofen 400 mg, single dose.',
    plan: 'Screen breaks every 30 minutes, adequate sleep.'
  }
},
{
  id: 'VS-J010',
  patientId: 'ML-24F0J1',
  submittedAt: '2026-08-20T09:30:00+08:00',
  status: 'Completed',
  clinical: {
    dateTime: '2026-08-20T09:05',
    physician: 'Dr. Grace T. Uy',
    chiefComplaint: 'Mild wheezing after PE class',
    weight: '57', height: '168', bp: '110/70', hr: '104', rr: '24', temp: '36.9',
    physicalExam: { 'Chest & Lungs': 'Expiratory wheezes, both lung fields' },
    assessment: 'Exercise-induced bronchospasm, responded to nebulization.',
    diagnosis: 'Bronchial asthma, mild intermittent exacerbation',
    treatment: 'Salbutamol nebulization ×1. Continue maintenance inhaler.',
    plan: 'Use reliever inhaler 15 minutes before PE.',
    followUpDate: '2026-08-27'
  }
},
{
  id: 'VS-J009',
  patientId: 'ML-24F0J1',
  submittedAt: '2026-07-03T12:00:00+08:00',
  status: 'Completed',
  clinical: {
    dateTime: '2026-07-03T11:40',
    physician: 'Dr. Liza M. Abrenica',
    chiefComplaint: 'Abrasion on right elbow after a fall',
    weight: '57', height: '168', bp: '110/70', hr: '80', rr: '16', temp: '36.7',
    diagnosis: 'Superficial abrasion, right elbow',
    treatment: 'Wound cleaning, povidone-iodine, sterile dressing.',
    plan: 'Keep dry for 2 days.'
  }
},
{
  id: 'VS-J008',
  patientId: 'ML-24F0J1',
  submittedAt: '2026-03-18T13:45:00+08:00',
  status: 'Completed',
  clinical: {
    dateTime: '2026-03-18T13:20',
    physician: 'Dr. Ramon P. Villareal',
    chiefComplaint: 'Loose bowel movement for 2 days',
    weight: '56', height: '168', bp: '105/70', hr: '88', rr: '18', temp: '37.2',
    diagnosis: 'Acute gastroenteritis, mild',
    treatment: 'Oral rehydration solution after every loose stool.',
    plan: 'Soft diet, return if blood in stool.'
  }
},
{
  id: 'VS-J007',
  patientId: 'ML-24F0J1',
  submittedAt: '2026-02-02T10:10:00+08:00',
  status: 'Completed',
  clinical: {
    dateTime: '2026-02-02T09:40',
    physician: 'Dr. Grace T. Uy',
    chiefComplaint: 'Annual physical examination',
    weight: '56', height: '167', bp: '110/70', hr: '72', rr: '16', temp: '36.6',
    diagnosis: 'Fit for academic and physical activities',
    treatment: 'None required.'
  }
},
{
  id: 'VS-J006',
  patientId: 'ML-24F0J1',
  submittedAt: '2025-11-25T15:20:00+08:00',
  status: 'Archived',
  clinical: {
    dateTime: '2025-11-25T15:00',
    physician: 'Dr. Liza M. Abrenica',
    chiefComplaint: 'Sore throat',
    temp: '37.4', hr: '84', rr: '18', bp: '110/70',
    diagnosis: 'Acute pharyngitis',
    treatment: 'Warm saline gargle, lozenges. Penicillin avoided due to allergy.'
  }
},
{
  id: 'VS-J005',
  patientId: 'ML-24F0J1',
  submittedAt: '2025-09-09T08:30:00+08:00',
  status: 'Archived',
  clinical: {
    dateTime: '2025-09-09T08:10',
    physician: 'Dr. Ramon P. Villareal',
    chiefComplaint: 'Dizziness during flag ceremony',
    bp: '100/60', hr: '64', rr: '16', temp: '36.5',
    diagnosis: 'Vasovagal presyncope',
    treatment: 'Rest in supine position, oral fluids.'
  }
},
{
  id: 'VS-J004',
  patientId: 'ML-24F0J1',
  submittedAt: '2025-06-14T11:00:00+08:00',
  status: 'Archived',
  clinical: {
    dateTime: '2025-06-14T10:35',
    physician: 'Dr. Grace T. Uy',
    chiefComplaint: 'Fever since yesterday',
    temp: '38.5', hr: '98', rr: '20', bp: '110/70',
    diagnosis: 'Viral syndrome',
    treatment: 'Paracetamol 500 mg every 4 hours as needed.'
  }
},
{
  id: 'VS-J003',
  patientId: 'ML-24F0J1',
  submittedAt: '2025-03-03T14:15:00+08:00',
  status: 'Archived',
  clinical: {
    dateTime: '2025-03-03T13:50',
    physician: 'Dr. Liza M. Abrenica',
    chiefComplaint: 'Itchy, watery eyes',
    diagnosis: 'Allergic conjunctivitis',
    treatment: 'Antihistamine eye drops, 1 drop each eye twice daily.'
  }
},
{
  id: 'VS-J002',
  patientId: 'ML-24F0J1',
  submittedAt: '2024-11-20T16:05:00+08:00',
  status: 'Archived',
  clinical: {
    dateTime: '2024-11-20T15:40',
    physician: 'Dr. Ramon P. Villareal',
    chiefComplaint: 'Sprained left ankle during intramurals',
    diagnosis: 'Ankle sprain, grade I',
    treatment: 'Rest, ice, compression, elevation. Cold compress.'
  }
},
{
  id: 'VS-J001',
  patientId: 'ML-24F0J1',
  submittedAt: '2024-08-15T09:00:00+08:00',
  status: 'Archived',
  clinical: {
    dateTime: '2024-08-15T08:30',
    physician: 'Dr. Grace T. Uy',
    chiefComplaint: 'Pre-enrollment medical examination',
    diagnosis: 'Fit for enrollment',
    treatment: 'None required.'
  }
},
{
  id: 'VS-M002',
  patientId: 'ML-24A7K2',
  submittedAt: '2026-06-02T10:20:00+08:00',
  status: 'Completed',
  clinical: {
    dateTime: '2026-06-02T10:00',
    physician: 'Dr. Liza M. Abrenica',
    chiefComplaint: 'Asthma check-up',
    rr: '18', hr: '82', temp: '36.7', bp: '110/70',
    diagnosis: 'Bronchial asthma, well controlled',
    treatment: 'Continue maintenance inhaler.'
  }
},
{
  id: 'VS-M001',
  patientId: 'ML-24A7K2',
  submittedAt: '2025-10-10T13:30:00+08:00',
  status: 'Archived',
  clinical: {
    dateTime: '2025-10-10T13:05',
    physician: 'Dr. Grace T. Uy',
    chiefComplaint: 'Fever and body malaise',
    temp: '38.2',
    diagnosis: 'Influenza-like illness',
    treatment: 'Paracetamol, oral fluids, rest.'
  }
},
{
  id: 'VS-P001',
  patientId: 'ML-24B3Q9',
  submittedAt: '2026-05-11T11:15:00+08:00',
  status: 'Completed',
  clinical: {
    dateTime: '2026-05-11T10:50',
    physician: 'Dr. Ramon P. Villareal',
    chiefComplaint: 'Lower back pain after lifting book boxes',
    diagnosis: 'Lumbar muscle strain',
    treatment: 'Mefenamic acid 500 mg three times daily for 3 days. Warm compress.'
  }
},
{
  id: 'VS-K001',
  patientId: 'ML-24C8M1',
  submittedAt: '2026-01-15T12:40:00+08:00',
  status: 'Completed',
  clinical: {
    dateTime: '2026-01-15T12:15',
    physician: 'Dr. Grace T. Uy',
    chiefComplaint: 'Itchy rashes after lunch',
    diagnosis: 'Urticaria, suspected shellfish exposure',
    treatment: 'Cetirizine 10 mg once daily for 3 days.'
  }
},
{
  id: 'VS-B001',
  patientId: 'ML-24D5R6',
  submittedAt: '2026-04-22T09:50:00+08:00',
  status: 'Follow-up Required',
  clinical: {
    dateTime: '2026-04-22T09:20',
    physician: 'Dr. Liza M. Abrenica',
    chiefComplaint: 'Seizure medication review',
    diagnosis: 'Epilepsy, controlled on medication',
    treatment: 'Continue levetiracetam as prescribed by neurologist.',
    followUpDate: '2026-11-05'
  }
}];