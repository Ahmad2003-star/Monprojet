 import { useNavigate } from 'react-router-dom'

export default function Accueil() {
  const navigate = useNavigate()

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f7fa', color: '#333', margin: 0 }}>

      {/* HEADER */}
      <header id="accueil" style={{ backgroundColor: '#0b3d91', color: 'white', padding: '20px', textAlign: 'center', position: 'relative' }}>
        <img src="/images/0 2.png" alt="Logo UNSTIM" style={{ position: 'absolute', top: 15, left: 10, width: 80, height: 80, objectFit: 'contain', backgroundColor: 'white', borderRadius: 8 }} />
        <img src="/images/img_logoFAST-NATI.jpg" alt="Logo FAST" style={{ position: 'absolute', top: 15, right: 10, width: 80, height: 80, objectFit: 'contain', borderRadius: 8 }} />
        <h1 style={{ margin: 0, fontSize: 28 }}>FAST Natitingou</h1>
        <p style={{ margin: '8px 0 0' }}>Plateforme Web de Gestion Académique</p>
      </header>

      {/* NAV */}
      <nav style={{ backgroundColor: '#082c6c', padding: '12px', textAlign: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        {[
          { label: 'Accueil', id: 'accueil' },
          { label: 'À propos', id: 'apropos' },
          { label: 'Fonctionnalités', id: 'fonctionnalites' },
          { label: 'Aide', id: 'aide' },
          { label: 'Contact', id: 'contact' },
        ].map(({ label, id }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            style={{ color: 'white', background: 'none', border: 'none', margin: '0 12px', fontWeight: 'bold', cursor: 'pointer', fontSize: 14 }}
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => navigate('/login')}
          style={{ color: '#0b3d91', backgroundColor: 'white', border: 'none', borderRadius: 4, padding: '6px 18px', marginLeft: 15, fontWeight: 'bold', cursor: 'pointer', fontSize: 14 }}
        >
          Connexion
        </button>
      </nav>
<img src="/images/images.webp" alt="bannière" style={{ width: '100%', height: '15px', display: 'block' }} />
      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '70px 20px', backgroundColor: '#e8f0fe' }}>
        <h2 style={{ color: '#0b3d91', fontSize: 26 }}>Bienvenue sur la plateforme académique de la FAST-NATI</h2>
        <p style={{ maxWidth: 600, margin: '0 auto', fontSize: 16 }}>
          Une solution moderne pour la gestion des étudiants, des notes, des emplois du temps et des activités académiques.
        </p>
        <button
          onClick={() => navigate('/login')}
          style={{ marginTop: 25, padding: '14px 30px', backgroundColor: '#0b3d91', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 16, fontWeight: 'bold' }}
        >
          Accéder à la plateforme
        </button>
      </section>

      {/* À PROPOS */}
      <section id="apropos" style={{ padding: 40, margin: '20px', backgroundColor: 'white', borderRadius: 10 }}>
        <h2 style={{ color: '#0b3d91' }}>À propos de la FAST-NATI</h2>
        <p>La FAST-NATI (Faculté des Sciences et Techniques de Natitingou) est une composante de l'UNSTIM spécialisée dans la formation scientifique et technologique.</p>
        <p>Elle contribue activement à la formation de cadres qualifiés dans plusieurs domaines scientifiques, techniques et environnementaux.</p>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 20 }}>
          <div style={{ flex: 1, minWidth: 250, backgroundColor: '#f0f4ff', padding: 20, borderRadius: 10 }}>
            <h3 style={{ color: '#0b3d91' }}>🎯 Notre Vision</h3>
            <p>Devenir une référence en formation scientifique et technologique au Bénin et en Afrique de l'Ouest.</p>
          </div>
          <div style={{ flex: 1, minWidth: 250, backgroundColor: '#f0f4ff', padding: 20, borderRadius: 10 }}>
            <h3 style={{ color: '#0b3d91' }}>📚 Notre Mission</h3>
            <p>Former des professionnels compétents grâce à un enseignement moderne, pratique et innovant.</p>
          </div>
          <div style={{ flex: 1, minWidth: 250, backgroundColor: '#f0f4ff', padding: 20, borderRadius: 10 }}>
            <h3 style={{ color: '#0b3d91' }}>🏛️ Notre Histoire</h3>
            <p>Fondée dans le cadre de l'UNSTIM, la FAST-NATI s'est imposée comme un pôle d'excellence scientifique au nord du Bénin.</p>
          </div>
        </div>
      </section>

      {/* FONCTIONNALITÉS */}
      <section id="fonctionnalites" style={{ padding: 40, margin: '20px', backgroundColor: 'white', borderRadius: 10 }}>
        <h2 style={{ color: '#0b3d91' }}>Fonctionnalités de la plateforme</h2>
        <p style={{ marginBottom: 20 }}>La plateforme offre trois espaces distincts adaptés à chaque profil utilisateur.</p>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[
            { emoji: '🎓', titre: 'Espace Étudiant', items: ['Consultation des notes', 'Emploi du temps', 'Téléchargement du relevé PDF', 'Suivi de la moyenne générale'] },
            { emoji: '👨‍🏫', titre: 'Espace Enseignant', items: ['Saisie des notes CC et Examen', 'Calcul automatique des moyennes', 'Emploi du temps personnel', 'Gestion par semestre'] },
            { emoji: '🏢', titre: 'Espace Administration', items: ['Gestion des utilisateurs', 'Validation des relevés', 'Statistiques en temps réel', 'Gestion des matières'] },
          ].map(({ emoji, titre, items }) => (
            <div key={titre} style={{ flex: 1, minWidth: 250, backgroundColor: '#f0f4ff', padding: 20, borderRadius: 10 }}>
              <h3 style={{ color: '#0b3d91' }}>{emoji} {titre}</h3>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {items.map(item => <li key={item} style={{ marginBottom: 6 }}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* AIDE */}
      <section id="aide" style={{ padding: 40, margin: '20px', backgroundColor: 'white', borderRadius: 10 }}>
        <h2 style={{ color: '#0b3d91' }}>Aide & Guide d'utilisation</h2>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[
            { q: '❓ Comment me connecter ?', r: 'Cliquez sur le bouton "Connexion" en haut à droite. Entrez votre nom d\'utilisateur et mot de passe fournis par l\'administration.' },
            { q: '📄 Comment obtenir mon relevé ?', r: 'Connectez-vous avec votre compte étudiant, allez dans "Mes notes" et cliquez sur "Télécharger mon relevé PDF".' },
            { q: '🔑 Mot de passe oublié ?', r: 'Contactez l\'administration de la FAST-NATI pour réinitialiser votre mot de passe.' },
            { q: '📊 Comment sont calculées les moyennes ?', r: 'La moyenne est calculée selon la formule : Note CC × 40% + Note Examen × 60%. Pour les matières sans CC, la note d\'examen est retenue directement.' },
          ].map(({ q, r }) => (
            <div key={q} style={{ flex: 1, minWidth: 280, backgroundColor: '#f0f4ff', padding: 20, borderRadius: 10 }}>
              <h4 style={{ color: '#0b3d91', marginTop: 0 }}>{q}</h4>
              <p style={{ margin: 0 }}>{r}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: 40, margin: '20px', backgroundColor: 'white', borderRadius: 10 }}>
        <h2 style={{ color: '#0b3d91' }}>Contact</h2>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 250 }}>
            <p>📍 <strong>Adresse :</strong>BP : 14, Natitingou, Bénin</p>
            <p>📧 <strong>Email :</strong> fast@unstim.bj</p>
            <p>📞 <strong>Téléphone :</strong> +229 22 41 13 66</p>
            <p>🌐 <strong>Site web :</strong> www.unstim.bj</p>
          </div>
          <div style={{ flex: 1, minWidth: 250, backgroundColor: '#f0f4ff', padding: 20, borderRadius: 10 }}>
            <h3 style={{ color: '#0b3d91', marginTop: 0 }}>Horaires d'ouverture</h3>
            <p>🕐 Lundi – Vendredi : 8h00 – 17h00</p>
            <p>🕐 Samedi : 8h00 – 12h00</p>
            <p>❌ Dimanche : Fermé</p>
          </div>
        </div>
      </section>
      <img src="/images/images.webp" alt="bannière" style={{ width: '100%', height: '15px', display: 'block' }} />
      {/* FOOTER */}
      <footer style={{ backgroundColor: '#0b3d91', color: 'white', textAlign: 'center', padding: '20px 15px', marginTop: 20 }}>
        <p style={{ margin: '0 0 8px' }}>© 2026 FAST Natitingou — Plateforme Académique</p>
        <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>UNSTIM — Université Nationale des Sciences, Technologies, Ingénierie et Mathématiques</p>
      </footer>

    </div>
  )
}
