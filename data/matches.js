const groups = [
  {
    group: "A",
    matches: [
      { id: "A-01", date: "2026-06-11", dateLabel: "11 de junho", dayName: "quinta-feira", time: "16h", home: "México", away: "África do Sul" },
      { id: "A-02", date: "2026-06-11", dateLabel: "11 de junho", dayName: "quinta-feira", time: "23h", home: "Coreia do Sul", away: "República Tcheca" },
      { id: "A-03", date: "2026-06-18", dateLabel: "18 de junho", dayName: "quinta-feira", time: "13h", home: "República Tcheca", away: "África do Sul" },
      { id: "A-04", date: "2026-06-18", dateLabel: "18 de junho", dayName: "quinta-feira", time: "22h", home: "México", away: "Coreia do Sul" },
      { id: "A-06", date: "2026-06-24", dateLabel: "24 de junho", dayName: "quarta-feira", time: "22h", home: "República Tcheca", away: "México" },
      { id: "A-05", date: "2026-06-24", dateLabel: "24 de junho", dayName: "quarta-feira", time: "22h", home: "África do Sul", away: "Coreia do Sul" }
    ]
  },
  {
    group: "B",
    matches: [
      { id: "B-01", date: "2026-06-12", dateLabel: "12 de junho", dayName: "sexta-feira", time: "16h", home: "Canadá", away: "Bósnia" },
      { id: "B-02", date: "2026-06-13", dateLabel: "13 de junho", dayName: "sábado", time: "16h", home: "Catar", away: "Suíça" },
      { id: "B-03", date: "2026-06-18", dateLabel: "18 de junho", dayName: "quinta-feira", time: "16h", home: "Suíça", away: "Bósnia" },
      { id: "B-04", date: "2026-06-18", dateLabel: "18 de junho", dayName: "quinta-feira", time: "19h", home: "Canadá", away: "Catar" },
      { id: "B-05", date: "2026-06-24", dateLabel: "24 de junho", dayName: "quarta-feira", time: "16h", home: "Suíça", away: "Canadá" },
      { id: "B-06", date: "2026-06-24", dateLabel: "24 de junho", dayName: "quarta-feira", time: "16h", home: "Bósnia", away: "Catar" }
    ]
  },
  {
    group: "C",
    matches: [
      { id: "C-01", date: "2026-06-13", dateLabel: "13 de junho", dayName: "sábado", time: "19h", home: "Brasil", away: "Marrocos" },
      { id: "C-02", date: "2026-06-13", dateLabel: "13 de junho", dayName: "sábado", time: "22h", home: "Haiti", away: "Escócia" },
      { id: "C-03", date: "2026-06-19", dateLabel: "19 de junho", dayName: "sexta-feira", time: "19h", home: "Escócia", away: "Marrocos" },
      { id: "C-04", date: "2026-06-19", dateLabel: "19 de junho", dayName: "sexta-feira", time: "21h30", home: "Brasil", away: "Haiti" },
      { id: "C-06", date: "2026-06-24", dateLabel: "24 de junho", dayName: "quarta-feira", time: "19h", home: "Escócia", away: "Brasil" },
      { id: "C-05", date: "2026-06-24", dateLabel: "24 de junho", dayName: "quarta-feira", time: "19h", home: "Marrocos", away: "Haiti" }
    ]
  },
  {
    group: "D",
    matches: [
      { id: "D-01", date: "2026-06-12", dateLabel: "12 de junho", dayName: "sexta-feira", time: "22h", home: "Estados Unidos", away: "Paraguai" },
      { id: "D-02", date: "2026-06-13", dateLabel: "13 de junho", dayName: "sábado", time: "01h (sábado para domingo)", home: "Austrália", away: "Turquia" },
      { id: "D-04", date: "2026-06-19", dateLabel: "19 de junho", dayName: "sexta-feira", time: "01h (sexta para sábado)", home: "Turquia", away: "Paraguai" },
      { id: "D-03", date: "2026-06-19", dateLabel: "19 de junho", dayName: "sexta-feira", time: "16h", home: "Estados Unidos", away: "Austrália" },
      { id: "D-05", date: "2026-06-25", dateLabel: "25 de junho", dayName: "quinta-feira", time: "23h", home: "Turquia", away: "Estados Unidos" },
      { id: "D-06", date: "2026-06-25", dateLabel: "25 de junho", dayName: "quinta-feira", time: "23h", home: "Paraguai", away: "Austrália" }
    ]
  },
  {
    group: "E",
    matches: [
      { id: "E-01", date: "2026-06-14", dateLabel: "14 de junho", dayName: "domingo", time: "14h", home: "Alemanha", away: "Curaçao" },
      { id: "E-02", date: "2026-06-14", dateLabel: "14 de junho", dayName: "domingo", time: "20h", home: "Costa do Marfim", away: "Equador" },
      { id: "E-03", date: "2026-06-20", dateLabel: "20 de junho", dayName: "sábado", time: "17h", home: "Alemanha", away: "Costa do Marfim" },
      { id: "E-04", date: "2026-06-20", dateLabel: "20 de junho", dayName: "sábado", time: "21h", home: "Equador", away: "Curaçao" },
      { id: "E-05", date: "2026-06-25", dateLabel: "25 de junho", dayName: "quinta-feira", time: "17h", home: "Equador", away: "Alemanha" },
      { id: "E-06", date: "2026-06-25", dateLabel: "25 de junho", dayName: "quinta-feira", time: "17h", home: "Curaçao", away: "Costa do Marfim" }
    ]
  },
  {
    group: "F",
    matches: [
      { id: "F-01", date: "2026-06-14", dateLabel: "14 de junho", dayName: "domingo", time: "17h", home: "Holanda", away: "Japão" },
      { id: "F-02", date: "2026-06-14", dateLabel: "14 de junho", dayName: "domingo", time: "23h", home: "Suécia", away: "Tunísia" },
      { id: "F-04", date: "2026-06-20", dateLabel: "20 de junho", dayName: "sábado", time: "01h (sábado para domingo)", home: "Tunísia", away: "Japão" },
      { id: "F-03", date: "2026-06-20", dateLabel: "20 de junho", dayName: "sábado", time: "14h", home: "Holanda", away: "Suécia" },
      { id: "F-06", date: "2026-06-25", dateLabel: "25 de junho", dayName: "quinta-feira", time: "20h", home: "Japão", away: "Suécia" },
      { id: "F-05", date: "2026-06-25", dateLabel: "25 de junho", dayName: "quinta-feira", time: "20h", home: "Tunísia", away: "Holanda" }
    ]
  },
  {
    group: "G",
    matches: [
      { id: "G-01", date: "2026-06-15", dateLabel: "15 de junho", dayName: "segunda-feira", time: "16h", home: "Bélgica", away: "Egito" },
      { id: "G-02", date: "2026-06-15", dateLabel: "15 de junho", dayName: "segunda-feira", time: "22h", home: "Irã", away: "Nova Zelândia" },
      { id: "G-03", date: "2026-06-21", dateLabel: "21 de junho", dayName: "domingo", time: "16h", home: "Bélgica", away: "Irã" },
      { id: "G-04", date: "2026-06-21", dateLabel: "21 de junho", dayName: "domingo", time: "22h", home: "Nova Zelândia", away: "Egito" },
      { id: "G-05", date: "2026-06-26", dateLabel: "26 de junho", dayName: "sexta-feira", time: "00h (sexta para sábado)", home: "Egito", away: "Irã" },
      { id: "G-06", date: "2026-06-26", dateLabel: "26 de junho", dayName: "sexta-feira", time: "00h (sexta para sábado)", home: "Nova Zelândia", away: "Bélgica" }
    ]
  },
  {
    group: "H",
    matches: [
      { id: "H-01", date: "2026-06-15", dateLabel: "15 de junho", dayName: "segunda-feira", time: "13h", home: "Espanha", away: "Cabo Verde" },
      { id: "H-02", date: "2026-06-15", dateLabel: "15 de junho", dayName: "segunda-feira", time: "19h", home: "Arábia Saudita", away: "Uruguai" },
      { id: "H-03", date: "2026-06-21", dateLabel: "21 de junho", dayName: "domingo", time: "13h", home: "Espanha", away: "Arábia Saudita" },
      { id: "H-04", date: "2026-06-21", dateLabel: "21 de junho", dayName: "domingo", time: "19h", home: "Uruguai", away: "Cabo Verde" },
      { id: "H-05", date: "2026-06-26", dateLabel: "26 de junho", dayName: "sexta-feira", time: "21h", home: "Cabo Verde", away: "Arábia Saudita" },
      { id: "H-06", date: "2026-06-26", dateLabel: "26 de junho", dayName: "sexta-feira", time: "21h", home: "Uruguai", away: "Espanha" }
    ]
  },
  {
    group: "I",
    matches: [
      { id: "I-01", date: "2026-06-16", dateLabel: "16 de junho", dayName: "terça-feira", time: "16h", home: "França", away: "Senegal" },
      { id: "I-02", date: "2026-06-16", dateLabel: "16 de junho", dayName: "terça-feira", time: "19h", home: "Iraque", away: "Noruega" },
      { id: "I-03", date: "2026-06-22", dateLabel: "22 de junho", dayName: "segunda-feira", time: "18h", home: "França", away: "Iraque" },
      { id: "I-04", date: "2026-06-22", dateLabel: "22 de junho", dayName: "segunda-feira", time: "21h", home: "Noruega", away: "Senegal" },
      { id: "I-06", date: "2026-06-26", dateLabel: "26 de junho", dayName: "sexta-feira", time: "16h", home: "Noruega", away: "França" },
      { id: "I-05", date: "2026-06-26", dateLabel: "26 de junho", dayName: "sexta-feira", time: "16h", home: "Senegal", away: "Iraque" }
    ]
  },
  {
    group: "J",
    matches: [
      { id: "J-01", date: "2026-06-16", dateLabel: "16 de junho", dayName: "terça-feira", time: "22h", home: "Argentina", away: "Argélia" },
      { id: "J-02", date: "2026-06-16", dateLabel: "16 de junho", dayName: "terça-feira", time: "01h (terça para quarta-feira)", home: "Áustria", away: "Jordânia" },
      { id: "J-03", date: "2026-06-22", dateLabel: "22 de junho", dayName: "segunda-feira", time: "14h", home: "Argentina", away: "Áustria" },
      { id: "J-04", date: "2026-06-22", dateLabel: "22 de junho", dayName: "segunda-feira", time: "00h (segunda para terça)", home: "Jordânia", away: "Argélia" },
      { id: "J-06", date: "2026-06-27", dateLabel: "27 de junho", dayName: "sábado", time: "23h", home: "Argélia", away: "Áustria" },
      { id: "J-05", date: "2026-06-27", dateLabel: "27 de junho", dayName: "sábado", time: "23h", home: "Jordânia", away: "Argentina" }
    ]
  },
  {
    group: "K",
    matches: [
      { id: "K-01", date: "2026-06-17", dateLabel: "17 de junho", dayName: "quarta-feira", time: "14h", home: "Portugal", away: "RD Congo" },
      { id: "K-02", date: "2026-06-17", dateLabel: "17 de junho", dayName: "quarta-feira", time: "23h", home: "Uzbequistão", away: "Colômbia" },
      { id: "K-03", date: "2026-06-23", dateLabel: "23 de junho", dayName: "terça-feira", time: "14h", home: "Portugal", away: "Uzbequistão" },
      { id: "K-04", date: "2026-06-23", dateLabel: "23 de junho", dayName: "terça-feira", time: "23h", home: "Colômbia", away: "RD Congo" },
      { id: "K-06", date: "2026-06-27", dateLabel: "27 de junho", dayName: "sábado", time: "20h30", home: "Colômbia", away: "Portugal" },
      { id: "K-05", date: "2026-06-27", dateLabel: "27 de junho", dayName: "sábado", time: "20h30", home: "RD Congo", away: "Uzbequistão" }
    ]
  },
  {
    group: "L",
    matches: [
      { id: "L-01", date: "2026-06-17", dateLabel: "17 de junho", dayName: "quarta-feira", time: "17h", home: "Inglaterra", away: "Croácia" },
      { id: "L-02", date: "2026-06-17", dateLabel: "17 de junho", dayName: "quarta-feira", time: "20h", home: "Gana", away: "Panamá" },
      { id: "L-03", date: "2026-06-23", dateLabel: "23 de junho", dayName: "terça-feira", time: "17h", home: "Inglaterra", away: "Gana" },
      { id: "L-04", date: "2026-06-23", dateLabel: "23 de junho", dayName: "terça-feira", time: "20h", home: "Panamá", away: "Croácia" },
      { id: "L-06", date: "2026-06-27", dateLabel: "27 de junho", dayName: "sábado", time: "18h", home: "Panamá", away: "Inglaterra" },
      { id: "L-05", date: "2026-06-27", dateLabel: "27 de junho", dayName: "sábado", time: "18h", home: "Croácia", away: "Gana" }
    ]
  }
];

module.exports = groups;
