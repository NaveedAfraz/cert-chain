import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      verify: {
        title: "Certificate Verification",
        subtitle: "Enter a cryptographic hash or certificate ID to instantly verify its authenticity on the blockchain.",
        inputPlaceholder: "Enter Certificate ID or Hash...",
        verifyButton: "Verify Now",
        verifying: "Verifying block...",
        successMsg: "Cryptographic proof validated.",
        validTitle: "Valid Credential",
        validDesc: "This credential has been mathematically proven to be authentic and untampered via the blockchain.",
        tamperedTitle: "Verification Failed",
        tamperedDesc: "The cryptographic proof does not match the blockchain record. This credential may be tampered or invalid.",
        revokedTitle: "Certificate Revoked",
        revokedDesc: "This certificate was permanently revoked by the issuing institution.",
        issuedTo: "Issued To",
        course: "Course / Program",
        issuer: "Issuer",
        issueDate: "Issue Date",
        txHash: "Transaction Hash",
        network: "Network",
        viewBlockchain: "View on Blockchain",
        revocationReason: "Revocation Reason",
        revokedDate: "Date Revoked"
      },
      home: {
        mainnetActive: "Mainnet Active",
        titlePrefix: "The Standard for",
        titleHighlight: "Immutable Truth",
        subtitle: "CertChain empowers institutions to issue cryptographically verifiable credentials directly to a decentralized ledger, eliminating fraud instantly.",
        verifyButton: "Verify Credential",
        learnMore: "Learn More"
      },
      nav: {
        home: "Home",
        institutions: "Institutions",
        publicVerifier: "Public Verifier",
        tamperLab: "Tamper Lab",
        pricing: "SaaS Pricing",
        login: "Log In",
        startTrial: "Start Free Trial",
        overview: "Overview",
        issueCert: "Issue Cert",
        records: "Records",
        portalSettings: "Portal Settings",
        publicProfile: "Public Profile",
        platformCentral: "Platform Central",
        myDashboard: "My Dashboard",
        signOut: "Sign Out securely"
      },
      directory: {
        network: "Verified Network",
        title: "Institution Directory",
        subtitle: "Explore verified institutions issuing tamper-proof credentials on the CertChain blockchain protocol.",
        searchPlaceholder: "Search institutions...",
        verifiedInstitutions: "Verified Institutions",
        totalCertificates: "Total Certificates",
        noResults: "No institutions match your search",
        certs: "certs",
        verified: "verified"
      },
      pricing: {
        subtitle: "SIMPLE SAAS PRICING",
        titlePrefix: "Scale your Trust",
        titleHighlight: "Protocol",
        desc: "Choose the plan that fits your institution's governance and volume requirements."
      },
      tamperLab: {
        badge: "Security Demonstration",
        titlePrefix: "Tamper Simulation",
        titleHighlight: "Lab",
        subtitle: "Try to forge a certificate. Modify any field and watch the cryptographic hash break in real-time — proving why blockchain credentials are unforgeable."
      },
      footer: {
        description: "The next generation of academic credentialing. Immutable, cryptographic, and instantly verifiable by anyone in the world.",
        protocol: "Protocol",
        resources: "Resources",
        metrics: "Trust Metrics",
        copyright: "CertChain Global Prototype. All rights reserved. Built for academic excellence."
      },
      about: {
        title: "About the Protocol",
        subtitle: "CertChain was built to solve the $1.2B global credential fraud problem by bridging institutional databases with Web3 immutability.",
        howItWorks: "How It Works",
        howItWorksDesc: "When an institution issues a certificate, the protocol generates a highly secure SHA-256 hash containing the student's name, their qualification, and the issue date. Rather than storing sensitive student data on public networks, only this cryptographic hash is written to the blockchain.",
        point1: "Data stays in secure relational databases.",
        point2: "Immutable hash stored on Ethereum nodes.",
        point3: "Real-time cryptographic verification.",
        techStack: "Technical Stack",
        smartContractsDesc: "Written in Solidity and deployed via Hardhat. The contracts act strictly as decentralized ledgers to record mapping truth values.",
        relayerDesc: "A high-performance Node.js backend leveraging Ethers.js abstracts the blockchain complexity away from the institution."
      }
    }
  },
  es: {
    translation: {
      verify: {
        title: "Verificación de Certificados",
        subtitle: "Ingrese un hash criptográfico o un ID de certificado para verificar instantáneamente su autenticidad en la blockchain.",
        inputPlaceholder: "Ingrese el ID del Certificado o Hash...",
        verifyButton: "Verificar Ahora",
        verifying: "Verificando bloque...",
        successMsg: "Prueba criptográfica validada.",
        validTitle: "Credencial Válida",
        validDesc: "Esta credencial ha sido demostrada matemáticamente como auténtica y no alterada a través de la blockchain.",
        tamperedTitle: "Verificación Fallida",
        tamperedDesc: "La prueba criptográfica no coincide con el registro de la blockchain. Esta credencial podría haber sido alterada.",
        revokedTitle: "Certificado Revocado",
        revokedDesc: "Este certificado fue revocado permanentemente por la institución emisora.",
        issuedTo: "Emitido A",
        course: "Curso / Programa",
        issuer: "Emisor",
        issueDate: "Fecha de Emisión",
        txHash: "Hash de Transacción",
        network: "Red",
        viewBlockchain: "Ver en Blockchain",
        revocationReason: "Razón de Revocación",
        revokedDate: "Fecha de Revocación"
      },
      home: {
        mainnetActive: "Mainnet Activo",
        titlePrefix: "El Estándar para la",
        titleHighlight: "Verdad Inmutable",
        subtitle: "CertChain permite a las instituciones emitir credenciales criptográficamente verificables directamente en un libro mayor descentralizado, eliminando el fraude instantáneamente.",
        verifyButton: "Verificar Credencial",
        learnMore: "Aprenda Más"
      },
      nav: {
        home: "Inicio",
        institutions: "Instituciones",
        publicVerifier: "Verificador Público",
        tamperLab: "Laboratorio de Fraude",
        pricing: "Precios SaaS",
        login: "Iniciar Sesión",
        startTrial: "Prueba Gratuita",
        overview: "Resumen",
        issueCert: "Emitir Certificado",
        records: "Registros",
        portalSettings: "Configuración",
        publicProfile: "Perfil Público",
        platformCentral: "Centro de Plataforma",
        myDashboard: "Mi Panel",
        signOut: "Cerrar Sesión seguro"
      },
      directory: {
        network: "Red Verificada",
        title: "Directorio de Instituciones",
        subtitle: "Explore instituciones verificadas que emiten credenciales a prueba de manipulaciones en el protocolo blockchain CertChain.",
        searchPlaceholder: "Buscar instituciones...",
        verifiedInstitutions: "Instituciones Verificadas",
        totalCertificates: "Certificados Totales",
        noResults: "No hay instituciones que coincidan con su búsqueda",
        certs: "certificados",
        verified: "verificado"
      },
      pricing: {
        subtitle: "PRECIOS SAAS SIMPLES",
        titlePrefix: "Escale su Protocolo",
        titleHighlight: "de Confianza",
        desc: "Elija el plan que se adapte a los requisitos de gobernanza y volumen de su institución."
      },
      tamperLab: {
        badge: "Demostración de Seguridad",
        titlePrefix: "Laboratorio de Simulación",
        titleHighlight: "de Fraude",
        subtitle: "Intente falsificar un certificado. Modifique cualquier campo y observe cómo se rompe el hash criptográfico en tiempo real, demostrando por qué las credenciales blockchain son infalsificables."
      },
      footer: {
        description: "La próxima generación de credenciales académicas. Inmutables, criptográficas y verificables instantáneamente por cualquier persona en el mundo.",
        protocol: "Protocolo",
        resources: "Recursos",
        metrics: "Métricas de Confianza",
        copyright: "Prototipo Global CertChain. Todos los derechos reservados. Construido para la excelencia académica."
      },
      about: {
        title: "Sobre el Protocolo",
        subtitle: "CertChain se construyó para resolver el problema global de fraude de credenciales de 1.2B $ conectando las bases de datos institucionales con la inmutabilidad de Web3.",
        howItWorks: "Cómo Funciona",
        howItWorksDesc: "Cuando una institución emite un certificado, el protocolo genera un hash SHA-256 altamente seguro que contiene el nombre del estudiante, su calificación y la fecha de emisión. En lugar de almacenar datos confidenciales de los estudiantes en redes públicas, solo este hash criptográfico se escribe en la blockchain.",
        point1: "Los datos permanecen en bases de datos relacionales seguras.",
        point2: "Hash inmutable almacenado en nodos de Ethereum.",
        point3: "Verificación criptográfica en tiempo real.",
        techStack: "Pila Técnica",
        smartContractsDesc: "Escrito en Solidity y desplegado a través de Hardhat. Los contratos actúan estrictamente como libros de contabilidad descentralizados para registrar valores de verdad.",
        relayerDesc: "Un backend Node.js de alto rendimiento que aprovecha Ethers.js abstrae la complejidad de la blockchain de la institución."
      }
    }
  },
  fr: {
    translation: {
      verify: {
        title: "Vérification de Certificat",
        subtitle: "Entrez une empreinte cryptographique ou un ID de certificat pour vérifier instantanément son authenticité sur la blockchain.",
        inputPlaceholder: "Entrez l'ID du certificat ou le Hash...",
        verifyButton: "Vérifier Maintenant",
        verifying: "Vérification du bloc...",
        successMsg: "Preuve cryptographique validée.",
        validTitle: "Certificat Valide",
        validDesc: "Ce certificat a été mathématiquement prouvé authentique et non falsifié via la blockchain.",
        tamperedTitle: "Échec de la Vérification",
        tamperedDesc: "La preuve cryptographique ne correspond pas à l'enregistrement de la blockchain. Ce certificat peut être falsifié.",
        revokedTitle: "Certificat Révoqué",
        revokedDesc: "Ce certificat a été révoqué définitivement par l'institution émettrice.",
        issuedTo: "Délivré À",
        course: "Cours / Programme",
        issuer: "Émetteur",
        issueDate: "Date de Délivrance",
        txHash: "Hash de Transaction",
        network: "Réseau",
        viewBlockchain: "Voir sur la Blockchain",
        revocationReason: "Raison de la Révocation",
        revokedDate: "Date de Révocation"
      },
      home: {
        mainnetActive: "Mainnet Actif",
        titlePrefix: "La Norme pour la",
        titleHighlight: "Vérité Immuable",
        subtitle: "CertChain permet aux institutions d'émettre des certificats vérifiables par cryptographie directement sur un registre décentralisé, éliminant la fraude instantanément.",
        verifyButton: "Vérifier le Titre",
        learnMore: "En Savoir Plus"
      },
      nav: {
        home: "Accueil",
        institutions: "Institutions",
        publicVerifier: "Vérificateur Public",
        tamperLab: "Labo Anti-fraude",
        pricing: "Tarifs SaaS",
        login: "Connexion",
        startTrial: "Essai Gratuit",
        overview: "Aperçu",
        issueCert: "Émettre Cert",
        records: "Dossiers",
        portalSettings: "Paramètres",
        publicProfile: "Profil Public",
        platformCentral: "Centre Plateforme",
        myDashboard: "Mon Tableau de Bord",
        signOut: "Déconnexion sécurisée"
      },
      directory: {
        network: "Réseau Vérifié",
        title: "Annuaire des Institutions",
        subtitle: "Explorez les institutions vérifiées émettant des titres infalsifiables sur le protocole blockchain CertChain.",
        searchPlaceholder: "Rechercher des institutions...",
        verifiedInstitutions: "Institutions Vérifiées",
        totalCertificates: "Certificats Totaux",
        noResults: "Aucune institution ne correspond à votre recherche",
        certs: "certificats",
        verified: "vérifié"
      },
      pricing: {
        subtitle: "TARIFS SAAS SIMPLES",
        titlePrefix: "Faites Évoluer",
        titleHighlight: "Votre Confiance",
        desc: "Choisissez le plan qui correspond aux exigences de gouvernance et de volume de votre institution."
      },
      tamperLab: {
        badge: "Démonstration de Sécurité",
        titlePrefix: "Laboratoire de Simulation",
        titleHighlight: "de Fraude",
        subtitle: "Essayez de falsifier un certificat. Modifiez n'importe quel champ et regardez le hachage cryptographique se briser en temps réel — prouvant pourquoi les identifiants blockchain sont infalsifiables."
      },
      footer: {
        description: "La prochaine génération de titres académiques. Immuable, cryptographique et vérifiable instantanément par quiconque dans le monde.",
        protocol: "Protocole",
        resources: "Ressources",
        metrics: "Indicateurs de Confiance",
        copyright: "Prototype Global CertChain. Tous droits réservés. Conçu pour l'excellence académique."
      },
      about: {
        title: "À Propos du Protocole",
        subtitle: "CertChain a été conçu pour résoudre le problème mondial de fraude aux diplômes de 1,2 milliard de dollars en reliant les bases de données institutionnelles à l'immuabilité du Web3.",
        howItWorks: "Comment Ça Marche",
        howItWorksDesc: "Lorsqu'une institution émet un certificat, le protocole génère un hachage SHA-256 hautement sécurisé contenant le nom de l'étudiant, sa qualification et la date d'émission. Au lieu de stocker des données sensibles sur les étudiants sur des réseaux publics, seul ce hachage cryptographique est inscrit sur la blockchain.",
        point1: "Les données restent dans des bases de données relationnelles sécurisées.",
        point2: "Hachage immuable stocké sur les nœuds Ethereum.",
        point3: "Vérification cryptographique en temps réel.",
        techStack: "Pile Technique",
        smartContractsDesc: "Écrit en Solidity et déployé via Hardhat. Les contrats agissent strictement comme des registres décentralisés pour enregistrer les valeurs de vérité.",
        relayerDesc: "Un backend Node.js performant utilisant Ethers.js abstrait la complexité de la blockchain de l'institution."
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
