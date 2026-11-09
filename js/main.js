/* SIGEP — interactions du site (JavaScript vanilla, sans dépendance).
   Chaque module vérifie la présence de ses éléments : le même fichier sert l'accueil et les pages réalisation. */
(() => {
  'use strict';
  const doc = document.documentElement;
  doc.classList.remove('sans-js');
  const mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const AR = doc.lang.startsWith('ar');
  const TXT = AR ? {
    themeClair: 'بدّل للألوان الفاتحة', themeSombre: 'بدّل للألوان الداكنة', menuOuvrir: 'حلّ القائمة', menuFermer: 'سكّر القائمة',
    projets: (n) => `${n} إنجاز معروض`, plus: (n) => `وري تصاور أخرى (باقي ${n})`,
  } : {
    themeClair: 'Passer en thème clair', themeSombre: 'Passer en thème sombre', menuOuvrir: 'Ouvrir le menu', menuFermer: 'Fermer le menu',
    projets: (n) => `${n} réalisations affichées`, plus: (n) => `Afficher plus de photos (${n} restantes)`,
  };
  const stockage = {
    lire: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    ecrire: (k, v) => { try { localStorage.setItem(k, v); } catch { /* stockage indisponible : sans effet */ } },
  };

  /* ---------- Thème clair / sombre ---------- */
  const boutonTheme = $('#bouton-theme');
  if (boutonTheme) {
    const sombreSysteme = () => window.matchMedia('(prefers-color-scheme: dark)').matches;
    const actuel = () => doc.dataset.theme || (sombreSysteme() ? 'dark' : 'light');
    const majLibelle = () => boutonTheme.setAttribute('aria-label', actuel() === 'dark' ? TXT.themeClair : TXT.themeSombre);
    majLibelle();
    boutonTheme.addEventListener('click', () => {
      doc.dataset.theme = actuel() === 'dark' ? 'light' : 'dark';
      stockage.ecrire('sigep-theme', doc.dataset.theme);
      majLibelle();
    });
  }

  /* ---------- En-tête : se réduit au défilement ; bouton « haut » ---------- */
  const entete = $('.entete');
  const haut = $('.haut');
  const surDefilement = () => {
    const y = window.scrollY;
    entete?.classList.toggle('reduit', y > 40);
    haut?.classList.toggle('visible', y > 900);
  };
  window.addEventListener('scroll', surDefilement, { passive: true });
  surDefilement();
  haut?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: mouvementReduit ? 'auto' : 'smooth' }));

  /* ---------- Menu mobile ---------- */
  const burger = $('.burger');
  const menu = $('#menu-mobile');
  if (burger && menu) {
    const basculer = (ouvrir) => {
      burger.setAttribute('aria-expanded', String(ouvrir));
      burger.setAttribute('aria-label', ouvrir ? TXT.menuFermer : TXT.menuOuvrir);
      document.body.classList.toggle('menu-ouvert', ouvrir);
      menu.inert = !ouvrir;
      if (ouvrir) $('a', menu)?.focus();
    };
    menu.inert = true;
    burger.addEventListener('click', () => basculer(burger.getAttribute('aria-expanded') !== 'true'));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => basculer(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { basculer(false); burger.focus(); }
    });
    window.matchMedia('(min-width: 1000px)').addEventListener('change', (m) => m.matches && basculer(false));
  }

  /* ---------- Lien actif dans la navigation ---------- */
  const liensNav = $$('.nav a[href^="#"]');
  if (liensNav.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entrees) => {
      entrees.forEach((en) => {
        if (!en.isIntersecting) return;
        liensNav.forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('href') === `#${en.target.id}`)));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    liensNav.forEach((a) => { const s = $(a.getAttribute('href')); if (s) obs.observe(s); });
  }

  /* ---------- Diaporama du héros ---------- */
  const diapos = $$('.heros-diaporama img');
  const points = $$('.points-diapo button');
  if (diapos.length > 1) {
    let i = 0;
    let minuteur;
    const montrer = (n) => {
      diapos[i].classList.remove('actif'); points[i]?.setAttribute('aria-current', 'false');
      i = (n + diapos.length) % diapos.length;
      const img = diapos[i];
      if (img.dataset.src) { img.src = img.dataset.src; img.srcset = img.dataset.srcset; delete img.dataset.src; }
      img.classList.add('actif'); points[i]?.setAttribute('aria-current', 'true');
    };
    const lancer = () => { if (!mouvementReduit) minuteur = setInterval(() => montrer(i + 1), 6500); };
    points.forEach((p, n) => p.addEventListener('click', () => { clearInterval(minuteur); montrer(n); lancer(); }));
    // Les images suivantes ne se chargent qu'après l'affichage de la première (LCP rapide).
    window.addEventListener('load', lancer);
  }

  /* ---------- Apparition au défilement ---------- */
  const reveles = $$('.revele');
  if (reveles.length && 'IntersectionObserver' in window && !mouvementReduit) {
    const obs = new IntersectionObserver((entrees) => entrees.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('vu'); obs.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    reveles.forEach((el) => obs.observe(el));
  } else reveles.forEach((el) => el.classList.add('vu'));

  /* ---------- Compteurs animés ---------- */
  const compteurs = $$('[data-compteur]');
  if (compteurs.length && 'IntersectionObserver' in window) {
    const animer = (el) => {
      const fin = Number(el.dataset.compteur);
      const suffixe = el.dataset.suffixe || '';
      const prefixe = el.dataset.prefixe || '';
      if (mouvementReduit) { el.textContent = prefixe + fin + suffixe; return; }
      const debut = performance.now();
      const pas = (t) => {
        const p = Math.min((t - debut) / 1400, 1);
        el.textContent = prefixe + Math.round(fin * (1 - Math.pow(1 - p, 3))) + suffixe;
        if (p < 1) requestAnimationFrame(pas);
      };
      requestAnimationFrame(pas);
    };
    const obs = new IntersectionObserver((entrees) => entrees.forEach((en) => {
      if (en.isIntersecting) { animer(en.target); obs.unobserve(en.target); }
    }), { threshold: .6 });
    compteurs.forEach((el) => obs.observe(el));
  }

  /* ---------- Filtres des réalisations ---------- */
  const filtresProjets = $('#filtres-projets');
  if (filtresProjets) {
    filtresProjets.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      $$('button', filtresProjets).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      const f = b.dataset.filtre;
      $$('#liste-projets .projet').forEach((p) => p.classList.toggle('masque', f !== 'tous' && !p.dataset.types.split(' ').includes(f)));
      $('#annonce-projets').textContent = TXT.projets($$('#liste-projets .projet:not(.masque)').length);
    });
  }

  /* ---------- Galerie : onglets, filtres, « afficher plus » ---------- */
  const onglets = $$('.onglets [role="tab"]');
  onglets.forEach((tab) => {
    tab.addEventListener('click', () => {
      onglets.forEach((t) => {
        const actif = t === tab;
        t.setAttribute('aria-selected', String(actif)); t.tabIndex = actif ? 0 : -1;
        $(`#${t.getAttribute('aria-controls')}`).hidden = !actif;
      });
    });
    tab.addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      const n = (onglets.indexOf(tab) + (e.key === 'ArrowRight' ? 1 : -1) + onglets.length) % onglets.length;
      onglets[n].focus(); onglets[n].click();
    });
  });
  const grillePhotos = $('#grille-photos');
  if (grillePhotos) {
    const PAR_PAGE = 16;
    let filtre = 'tous';
    let visibles = PAR_PAGE;
    const plus = $('#plus-photos');
    const appliquer = () => {
      let n = 0;
      const items = $$('li', grillePhotos);
      const total = items.filter((li) => filtre === 'tous' || li.dataset.cat === filtre).length;
      items.forEach((li) => {
        const garde = filtre === 'tous' || li.dataset.cat === filtre;
        li.hidden = !garde || ++n > visibles;
      });
      plus.hidden = visibles >= total;
      plus.querySelector('span').textContent = TXT.plus(total - Math.min(visibles, total));
    };
    $('#filtres-photos')?.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      $$('#filtres-photos button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      filtre = b.dataset.filtre; visibles = PAR_PAGE; appliquer();
    });
    plus?.addEventListener('click', () => {
      const premierNouveau = $$('li', grillePhotos).filter((li) => !li.hidden).length;
      visibles += PAR_PAGE; appliquer();
      $$('li:not([hidden]) button', grillePhotos)[premierNouveau]?.focus();
    });
    appliquer();
  }

  /* ---------- Visionneuse plein écran (photos et vidéos) ---------- */
  const lb = $('#visionneuse');
  if (lb) {
    const scene = $('.scene', lb);
    const compteur = $('.compteur', lb);
    const legende = $('.legende', lb);
    let liste = [];
    let pos = 0;
    let declencheur = null;

    const afficher = () => {
      const el = liste[pos];
      scene.querySelectorAll('img, video').forEach((m) => m.remove());
      let media;
      if (el.dataset.lbType === 'video') {
        media = document.createElement('video');
        Object.assign(media, { src: el.dataset.lbSrc, poster: el.dataset.lbPoster || '', controls: true, playsInline: true, preload: 'metadata' });
        if (!mouvementReduit) media.autoplay = true;
      } else {
        media = new Image();
        media.alt = el.dataset.lbAlt || '';
        if (el.dataset.lbSrcset) { media.srcset = el.dataset.lbSrcset; media.sizes = '100vw'; }
        media.src = el.dataset.lbSrc;
      }
      scene.insertBefore(media, $('.suiv', scene));
      compteur.textContent = `${pos + 1} / ${liste.length}`;
      legende.textContent = el.dataset.lbLegende || el.dataset.lbAlt || '';
      $('.prec', lb).hidden = $('.suiv', lb).hidden = liste.length < 2;
      // Précharge la photo suivante pour une navigation instantanée.
      const suivant = liste[(pos + 1) % liste.length];
      if (suivant?.dataset.lbType !== 'video' && suivant?.dataset.lbSrc) { const p = new Image(); p.src = suivant.dataset.lbSrc; }
    };
    const ouvrir = (el) => {
      const groupe = el.closest('[data-lb-groupe]') || document;
      liste = $$('[data-lb-src]', groupe).filter((x) => !x.closest('[hidden]'));
      pos = Math.max(0, liste.indexOf(el));
      declencheur = el;
      afficher();
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => { lb.classList.add('ouverte'); $('.fermer', lb).focus(); });
    };
    const fermer = () => {
      lb.classList.remove('ouverte');
      scene.querySelectorAll('video').forEach((v) => v.pause());
      document.body.style.overflow = '';
      setTimeout(() => { lb.hidden = true; scene.querySelectorAll('img, video').forEach((m) => m.remove()); }, 250);
      declencheur?.focus();
    };
    const aller = (d) => { pos = (pos + d + liste.length) % liste.length; afficher(); };

    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-lb-src]');
      if (el) { e.preventDefault(); ouvrir(el); }
    });
    $('.fermer', lb).addEventListener('click', fermer);
    $('.prec', lb).addEventListener('click', () => aller(-1));
    $('.suiv', lb).addEventListener('click', () => aller(1));
    lb.addEventListener('click', (e) => { if (e.target === scene || e.target === lb) fermer(); });
    document.addEventListener('keydown', (e) => {
      if (lb.hidden || !lb.classList.contains('ouverte')) return;
      if (e.key === 'Escape') fermer();
      else if (e.key === 'ArrowRight') aller(AR ? -1 : 1); // en arabe, la lecture va de droite à gauche
      else if (e.key === 'ArrowLeft') aller(AR ? 1 : -1);
      else if (e.key === 'Tab') { // focus piégé dans la visionneuse
        const f = $$('button:not([hidden]), video', lb);
        const [p, d] = [f[0], f[f.length - 1]];
        if (e.shiftKey && document.activeElement === p) { e.preventDefault(); d.focus(); }
        else if (!e.shiftKey && document.activeElement === d) { e.preventDefault(); p.focus(); }
      }
    });
    // Glissement tactile gauche / droite
    let x0 = null;
    scene.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    scene.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50 && liste.length > 1) aller((dx < 0) !== AR ? 1 : -1);
      x0 = null;
    });
  }

  /* ---------- Carte Google Maps chargée à la demande (performance, vie privée) ---------- */
  $$('.carte-maps .charger').forEach((b) => b.addEventListener('click', () => {
    const f = document.createElement('iframe');
    Object.assign(f, { src: b.dataset.src, title: b.dataset.titre, loading: 'lazy', referrerPolicy: 'no-referrer-when-downgrade' });
    f.setAttribute('allowfullscreen', '');
    b.replaceWith(f);
  }));

  /* ---------- Fenêtre « devis gratuit » : les moyens de contact (sans formulaire) ---------- */
  const popup = $('#popup-devis');
  if (popup && typeof popup.showModal === 'function') {
    document.addEventListener('click', (e) => {
      if (!e.target.closest('[data-devis]')) return;
      e.preventDefault();
      if (document.body.classList.contains('menu-ouvert')) burger?.click();
      popup.showModal();
    });
    // Fermeture : bouton ✕ ou clic sur le fond (Échap est géré par le navigateur)
    popup.addEventListener('click', (e) => {
      if (e.target.closest('[data-fermer]') || e.target === popup) popup.close();
    });
  }

  /* ---------- Année du pied de page ---------- */
  $$('[data-annee]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
