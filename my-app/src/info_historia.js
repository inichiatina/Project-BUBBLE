const eras = [
    {
        title: "O nascimento da sétima arte",
        side: "left",
        year: "1895–1910",
        videoId: "C87lzxoHCDw",
        description: "O cinema nasceu em 1895, quando os irmãos Lumière realizaram em Paris a primeira projeção pública. Os filmes eram muito curtos e retratavam cenas simples do quotidiano, como trabalhadores a sair de fábricas ou comboios a chegar às estações. O principal objetivo era surpreender o público com a ilusão do movimento, razão pela qual este período é frequentemente designado por 'cinema de atração'. Poucos anos depois, Georges Méliès  introduziu narrativas ficcionais, cenários construídos, efeitos especiais e técnicas de montagem inovadoras. Obras como A Viagem à Lua (1902) demonstraram que o cinema podia ser mais do que um registo da realidade, tornando-se uma forma de expressão artística capaz de criar mundos imaginários e contar histórias complexas. "
    },
    {
        title: "Cinema Narrativo e Mudo",
        side: "right",
        year: "1910–1927",
        videoId: "Z7-QdoofMq8",
        description: "O cinema desenvolveu-se rapidamente como indústria e forma de arte, os realizadores aperfeiçoaram técnicas de montagem, enquadramento e construção narrativa, permitindo contar histórias mais longas e emocionalmente envolventes. Como ainda não existia som sincronizado, os filmes dependiam da expressividade dos atores e do acompanhamento musical ao vivo realizado por pianistas ou pequenas orquestras nas salas de exibição. Neste período surgiram figuras icónicas como Charlie Chaplin e Buster Keaton, paralelamente, o cinema começou a ser utilizado para fins políticos e propagandísticos, como aconteceu no Império Otomano e posteriormente na Turquia, onde documentários e filmes institucionais serviram para reforçar valores nacionais e apoiar projetos governamentais. "
    },
    {
        title: "Cinema Sonoro e Colorido",
        side: "left",
        year: "1927–1960",
        videoId: "22NQuPrwbHA",
        description: "A introdução do som sincronizado marcou uma das maiores revoluções da história do cinema. A partir de finais da década de 1920, filmes como The Lights of New York demonstraram o potencial do cinema falado. Esta inovação transformou profundamente a indústria cinematográfica, exigindo novas competências aos atores e abrindo espaço para géneros como os musicais. Poucos anos depois, a popularização do Technicolor trouxe a cor para os ecrãs, enriquecendo a experiência visual e permitindo criar universos mais vibrantes e realistas. Filmes como The Wizard of Oz e Gone with the Wind tornaram-se símbolos desta nova era. O período também coincidiu com a consolidação de Hollywood como principal centro mundial de produção cinematográfica, estabelecendo modelos narrativos e industriais que influenciam o cinema até aos dias de hoje. "
    },
    {
        title: "Movimentos Modernos",
        side: "right",
        year: "1950–1980",
        videoId: "T5IligQP7Fo",
        description: "Após a Segunda Guerra Mundial, vários movimentos cinematográficos procuraram romper com os modelos tradicionais dominantes. Itália privilegiou histórias do quotidiano e filmagens em cenários reais, refletindo as dificuldades sociais do pós-guerra enquanto a França introduziu maior liberdade criativa, experimentação narrativa e novas formas de filmar. Estas correntes influenciaram profundamente realizadores de todo o mundo, incluindo em Portugal. Durante este período, o cinema passou a ser estudado de forma mais sistemática nas universidades, afirmando-se como uma disciplina académica autónoma. Além disso, cresceram as reflexões teóricas sobre a linguagem cinematográfica, a manipulação do tempo e a relação entre o filme e o espetador. "
    },
    {
        title: "Portugal: Das Comédias Clássicas ao Cinema Novo",
        side: "left",
        year: "1930–1960 ",
        videoId: "j5KtGoOIWJc",
        description: "Em Portugal, as décadas de 1930 e 1940 ficaram marcadas pelas chamadas 'comédias à portuguesa', filmes que retratavam costumes populares e conquistaram um lugar importante na memória coletiva nacional. O chamado 'Ano Zero' de 1955, tradicionalmente visto como um ano sem cinema nacional, foi posteriormente reavaliado por investigadores que identificaram intensa produção de curtas-metragens e atividade cineclubista. A partir dos anos 1960 surgiu o Cinema Novo Português, um movimento influenciado pelas correntes europeias modernas, que procurou retratar a realidade social portuguesa através de uma linguagem mais inovadora e autoral. Realizadores como Paulo Rocha e Fernando Lopes desempenharam um papel fundamental nesta transformação. "
    },
    {
        title: "Revolução Digital",
        side: "right",
        year: "1990–2020",
        videoId: "E8WaFvwtphY",
        description: "O final do século XX trouxe uma mudança tecnológica com a substituição gradual da película pelas câmaras digitais. Esta revolução reduziu os custos de produção, facilitou a edição e permitiu a utilização de efeitos visuais cada vez mais sofisticados. A digitalização também alterou profundamente os processos de distribuição e exibição, tornando possível a circulação global de conteúdos através da internet. Ao mesmo tempo, a evolução da Web 2.0 incentivou novas formas de participação dos utilizadores e abriu caminho para experiências interativas. O público deixou de ser apenas consumidor passivo e passou a ter acesso a plataformas onde podia comentar, partilhar e até influenciar conteúdos audiovisuais.  "
    },
    {
        title: "Streaming e Transformação dos Hábitos de Consumo",
        side: "left",
        year: "Presente",
        videoId: "Q6hZoJE6vvQ",
        description: "O surgimento das plataformas de streaming alterou profundamente a forma como os filmes e séries são distribuídos e consumidos. Serviços digitais passaram a disponibilizar milhares de títulos de forma imediata e acessível, reduzindo a dependência das salas de cinema e dos formatos físicos. Esta transformação permitiu uma maior democratização do acesso aos conteúdos audiovisuais, mas também levantou debates sobre o futuro das salas de exibição tradicionais. A experiência coletiva do cinema passou a coexistir com um modelo cada vez mais individualizado, centrado no consumo através de computadores e dispositivos móveis. Além disso, os algoritmos de recomendação passaram a desempenhar um papel importante na descoberta de novos conteúdos, influenciando os hábitos culturais de milhões de espectadores em todo o mundo. "
    },
    {
        title: "Realidade Virtual e o Futuro do Cinema",
        side: "right",
        year: "Futuro",
        videoId: "gHB9Tg19gtc",
        description: "Muitos investigadores consideram que a próxima grande revolução cinematográfica está ligada à Realidade Virtual, ao Cinema 360º e aos ambientes digitais imersivos. Ao contrário das transformações anteriores, que alteraram sobretudo os meios técnicos de produção, estas tecnologias modificam a própria relação entre a obra e o espetador. A tradicional ‘quarta parede’ desaparece, permitindo que o utilizador participe diretamente na narrativa e explore o espaço virtual de forma autónoma. Em vez de seguir uma sequência fixa de acontecimentos, a experiência pode tornar-se dinâmica e não linear, oferecendo diferentes percursos narrativos. O desenvolvimento do metaverso e das experiências imersivas poderá levar à criação de novas linguagens artísticas e teóricas, redefinindo aquilo que entendemos por cinema no século XXI. "
    }
];

export default eras;