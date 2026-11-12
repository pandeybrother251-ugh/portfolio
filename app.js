import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// =========================================================================
// 1. CONFIGURATION (Paste your Firebase keys here when ready to go live)
// =========================================================================
const USE_DEMO_MODE = true; // Change to false once you add your firebaseConfig below

const HUB_PHYSICAL_ADDRESS = "DropVault Hub, Shop 4, 2nd Main, Yelahanka New Town, Bengaluru - 560064";
const ADMIN_EMAILS = ["pandeybrother251@gmail.com"]; // Add your admin Google email(s)

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase only if not in Demo Mode
let auth, db, storage;
if (!USE_DEMO_MODE) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  document.getElementById("modeBadge").textContent = "Live Hub";
  document.getElementById("modeBadge").className =
    "text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold";
}

// =========================================================================
// 2. STATE MANAGEMENT
// =========================================================================
let currentUser = null;
let userProfile = null;
let allParcels = [];

// Seed Demo Parcels for instant preview
let demoParcels = [
  {
    id: "demo-1",
    userId: "demo-user",
    userName: "Ayush Kumar",
    hubId: "HUB-1042",
    userPhone: "9876543210",
    doorstepAddress: "Room 204, Sri Sai Men's PG, 4th Cross, Bengaluru",
    courier: "Delhivery",
    item: "Myntra - Oversized Graphic Tee",
    trackingId: "DLV8839201",
    expectedDate: new Date().toISOString().split("T")[0],
    slot: "8:00 PM – 9:00 PM",
    status: "Received at Hub",
    photoUrl: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "demo-2",
    userId: "demo-user",
    userName: "Ayush Kumar",
    hubId: "HUB-1042",
    userPhone: "9876543210",
    doorstepAddress: "Room 204, Sri Sai Men's PG, 4th Cross, Bengaluru",
    courier: "Ekart (Flipkart)",
    item: "Flipkart - Running Shoes",
    trackingId: "FMPP192044",
    expectedDate: new Date().toISOString().split("T")[0],
    slot: "9:00 PM – 10:00 PM",
    status: "Expected at Hub",
    photoUrl: ""
  }
];

// =========================================================================
// 3. UI & NAVIGATION HELPERS
// =========================================================================
const views = ["authView", "onboardingView", "homeView", "bookView", "parcelsView", "adminView"];

window.switchTab = function (targetId) {
  views.forEach((v) => document.getElementById(v).classList.add("hidden"));
  document.getElementById(targetId).classList.remove("hidden");

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.target === targetId);
  });
};

document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => switchTab(btn.dataset.target));
});

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2800);
}

// Set default date in booking form to today
document.getElementById("parcelDate").value = new Date().toISOString().split("T")[0];

// =========================================================================
// 4. AUTHENTICATION & ONBOARDING
// =========================================================================
document.getElementById("demoLoginBtn").addEventListener("click", () => {
  currentUser = { uid: "demo-user", email: "pandeybrother251@gmail.com", displayName: "Ayush Kumar" };
  userProfile = {
    name: "Ayush Kumar",
    phone: "9876543210",
    doorstepAddress: "Room 204, Sri Sai Men's PG, 4th Cross, Bengaluru",
    hubId: "HUB-1042"
  };
  allParcels = [...demoParcels];
  enterApp();
  showToast("Logged into Demo Mode!");
});

document.getElementById("googleLoginBtn").addEventListener("click", async () => {
  if (USE_DEMO_MODE) {
    showToast("Switch USE_DEMO_MODE = false in app.js for Google Login");
    return;
  }
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error(err);
    showToast("Login failed: " + err.message);
  }
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  if (!USE_DEMO_MODE && auth) await signOut(auth);
  currentUser = null;
  userProfile = null;
  document.getElementById("bottomNav").classList.add("hidden");
  document.getElementById("logoutBtn").classList.add("hidden");
  switchTab("authView");
});

if (!USE_DEMO_MODE) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser = user;
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        userProfile = snap.data();
        enterApp();
      } else {
        document.getElementById("onboardName").value = user.displayName || "";
        document.getElementById("logoutBtn").classList.remove("hidden");
        switchTab("onboardingView");
      }
    } else {
      switchTab("authView");
    }
  });
}

document.getElementById("onboardingForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const profileData = {
    name: document.getElementById("onboardName").value.trim(),
    phone: document.getElementById("onboardPhone").value.trim(),
    doorstepAddress: document.getElementById("onboardAddress").value.trim(),
    hubId: userProfile?.hubId || `HUB-${randomDigits}`,
    email: currentUser.email
  };

  if (!USE_DEMO_MODE) {
    await setDoc(doc(db, "users", currentUser.uid), profileData);
  }
  userProfile = profileData;
  enterApp();
  showToast("Profile & Hub ID Saved!");
});

document.getElementById("editProfileBtn").addEventListener("click", () => {
  document.getElementById("onboardName").value = userProfile.name;
  document.getElementById("onboardPhone").value = userProfile.phone;
  document.getElementById("onboardAddress").value = userProfile.doorstepAddress;
  switchTab("onboardingView");
});

function enterApp() {
  document.getElementById("bottomNav").classList.remove("hidden");
  document.getElementById("logoutBtn").classList.remove("hidden");

  // Show/hide Admin tab based on email (always visible in Demo Mode)
  const isAdmin = USE_DEMO_MODE || ADMIN_EMAILS.includes(currentUser.email);
  document.getElementById("adminNavBtn").classList.toggle("hidden", !isAdmin);

  // Populate Home Card
  document.getElementById("userHubIdDisplay").textContent = userProfile.hubId;
  document.getElementById("formattedHubAddress").textContent =
    `${userProfile.name} (${userProfile.hubId}), ${HUB_PHYSICAL_ADDRESS}`;
  document.getElementById("userDoorstepDisplay").textContent = userProfile.doorstepAddress;
  document.getElementById("userPhoneDisplay").textContent = `WhatsApp: +91 ${userProfile.phone}`;

  if (USE_DEMO_MODE) {
    renderParcels();
  } else {
    subscribeToFirestoreParcels(isAdmin);
  }

  switchTab("homeView");
}

// Copy Address Button
document.getElementById("copyAddressBtn").addEventListener("click", () => {
  const text = document.getElementById("formattedHubAddress").textContent;
  navigator.clipboard.writeText(text);
  showToast("Hub Address Copied!");
});

// =========================================================================
// 5. BOOKING / LOGGING AN INCOMING PARCEL
// =========================================================================
document.getElementById("bookParcelForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const newParcel = {
    userId: currentUser.uid,
    userName: userProfile.name,
    hubId: userProfile.hubId,
    userPhone: userProfile.phone,
    doorstepAddress: userProfile.doorstepAddress,
    courier: document.getElementById("parcelCourier").value,
    item: document.getElementById("parcelItem").value.trim(),
    expectedDate: document.getElementById("parcelDate").value,
    trackingId: document.getElementById("parcelTracking").value.trim() || "N/A",
    slot: document.getElementById("parcelSlot").value,
    status: "Expected at Hub",
    photoUrl: ""
  };

  if (USE_DEMO_MODE) {
    newParcel.id = "demo-" + Date.now();
    allParcels.unshift(newParcel);
    renderParcels();
  } else {
    newParcel.createdAt = serverTimestamp();
    await addDoc(collection(db, "parcels"), newParcel);
  }

  e.target.reset();
  document.getElementById("parcelDate").value = new Date().toISOString().split("T")[0];
  showToast("Parcel Logged! Ship to your Hub ID.");
  switchTab("parcelsView");
});

// =========================================================================
// 6. REAL-TIME FIRESTORE LISTENER & RENDERING
// =========================================================================
function subscribeToFirestoreParcels(isAdmin) {
  const q = isAdmin
    ? query(collection(db, "parcels"), orderBy("createdAt", "desc"))
    : query(collection(db, "parcels"), where("userId", "==", currentUser.uid), orderBy("createdAt", "desc"));

  onSnapshot(q, (snapshot) => {
    allParcels = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderParcels();
  });
}

function getStatusBadge(status) {
  const styles = {
    "Expected at Hub": "bg-amber-500/15 text-amber-300 border-amber-500/30",
    "Received at Hub": "bg-sky-500/15 text-sky-300 border-sky-500/30",
    "Out for Evening Delivery": "bg-purple-500/15 text-purple-300 border-purple-500/30",
    "Delivered": "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
  };
  return styles[status] || "bg-slate-800 text-slate-300";
}

function renderParcels() {
  const myParcels = allParcels.filter((p) => p.userId === currentUser.uid);

  // Update Home Counters
  document.getElementById("activeParcelCount").textContent = myParcels.filter((p) => p.status !== "Delivered").length;
  document.getElementById("deliveredParcelCount").textContent = myParcels.filter((p) => p.status === "Delivered").length;

  // Render User Parcels
  const userList = document.getElementById("userParcelsList");
  if (myParcels.length === 0) {
    userList.innerHTML = `<div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-400">No parcels logged yet. Tap "Log Order" below when you place an online order.</div>`;
  } else {
    userList.innerHTML = myParcels
      .map(
        (p) => `
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div class="flex items-start justify-between gap-2">
          <div>
            <span class="text-[11px] font-bold text-indigo-400 uppercase">${p.courier}</span>
            <h3 class="text-sm font-bold text-white">${p.item}</h3>
            <p class="text-[11px] text-slate-400 mt-0.5">Slot: <strong class="text-slate-200">${p.slot}</strong> • Date: ${p.expectedDate}</p>
          </div>
          <span class="text-[10px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${getStatusBadge(p.status)}">
            ${p.status}
          </span>
        </div>
        ${
          p.photoUrl
            ? `<div class="pt-1">
                <p class="text-[10px] text-slate-400 mb-1"><i class="fa-solid fa-camera text-emerald-400 mr-1"></i>Hub Check-In Proof:</p>
                <img src="${p.photoUrl}" alt="Parcel Proof" class="w-full h-36 object-cover rounded-xl border border-slate-800" />
              </div>`
            : ""
        }
      </div>
    `
      )
      .join("");
  }

  renderAdminParcels();
}

// =========================================================================
// 7. ADMIN / HUB AGENT CONSOLE ACTIONS
// =========================================================================
document.getElementById("adminStatusFilter").addEventListener("change", renderAdminParcels);
document.getElementById("adminSlotFilter").addEventListener("change", renderAdminParcels);

function renderAdminParcels() {
  const statusFilter = document.getElementById("adminStatusFilter").value;
  const slotFilter = document.getElementById("adminSlotFilter").value;

  const filtered = allParcels.filter((p) => {
    const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
    const matchSlot = slotFilter === "ALL" || p.slot === slotFilter;
    return matchStatus && matchSlot;
  });

  const adminList = document.getElementById("adminParcelsList");
  if (filtered.length === 0) {
    adminList.innerHTML = `<div class="text-center text-xs text-slate-500 py-6">No parcels match this filter.</div>`;
    return;
  }

  adminList.innerHTML = filtered
    .map((p) => {
      const waMsg = encodeURIComponent(
        `Hi ${p.userName} (${p.hubId}), your ${p.courier} parcel (${p.item}) is at the DropVault Hub! Please reply with the delivery OTP if required.`
      );
      const waLink = `https://wa.me/91${p.userPhone}?text=${waMsg}`;

      return `
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div class="flex justify-between items-start">
          <div>
            <span class="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded">${p.hubId}</span>
            <span class="text-xs font-bold text-white ml-1.5">${p.userName}</span>
            <p class="text-xs text-slate-300 mt-1">${p.courier} • <strong>${p.item}</strong></p>
            <p class="text-[11px] text-slate-400 mt-0.5"><i class="fa-regular fa-clock mr-1"></i>${p.slot} | <i class="fa-solid fa-location-dot mr-1"></i>${p.doorstepAddress}</p>
          </div>
          <span class="text-[10px] font-bold px-2 py-1 rounded-full border ${getStatusBadge(p.status)}">${p.status}</span>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-2 gap-2 pt-1">
          <label class="cursor-pointer py-2 px-3 rounded-xl bg-sky-600/20 border border-sky-500/40 text-sky-300 text-xs font-semibold text-center hover:bg-sky-600/30 transition">
            <i class="fa-solid fa-camera mr-1"></i> Receive + Photo
            <input type="file" accept="image/*" capture="environment" class="hidden" onchange="handleCheckInPhoto('${p.id}', event)" />
          </label>

          <a href="${waLink}" target="_blank" class="py-2 px-3 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold text-center hover:bg-emerald-600/30 transition">
            <i class="fa-brands fa-whatsapp mr-1"></i> Ask OTP
          </a>

          <button onclick="updateParcelStatus('${p.id}', 'Out for Evening Delivery')" class="py-2 px-3 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 text-xs font-semibold hover:bg-purple-600/30 transition">
            <i class="fa-solid fa-motorcycle mr-1"></i> Out for Delivery
          </button>

          <button onclick="updateParcelStatus('${p.id}', 'Delivered')" class="py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition">
            <i class="fa-solid fa-check-double mr-1"></i> Mark Delivered
          </button>
        </div>
      </div>
    `;
    })
    .join("");
}

window.updateParcelStatus = async function (parcelId, newStatus) {
  if (USE_DEMO_MODE) {
    const target = allParcels.find((p) => p.id === parcelId);
    if (target) target.status = newStatus;
    renderParcels();
  } else {
    await updateDoc(doc(db, "parcels", parcelId), { status: newStatus });
  }
  showToast(`Status updated: ${newStatus}`);
};

window.handleCheckInPhoto = async function (parcelId, event) {
  const file = event.target.files[0];
  if (!file) return;

  showToast("Uploading check-in photo...");

  if (USE_DEMO_MODE) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const target = allParcels.find((p) => p.id === parcelId);
      if (target) {
        target.photoUrl = e.target.result;
        target.status = "Received at Hub";
      }
      renderParcels();
      showToast("Parcel Received & Photo Logged!");
    };
    reader.readAsDataURL(file);
  } else {
    const storageRef = ref(storage, `checkins/${parcelId}_${Date.now()}.jpg`);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    await updateDoc(doc(db, "parcels", parcelId), {
      photoUrl: downloadUrl,
      status: "Received at Hub"
    });
    showToast("Parcel Received & Photo Uploaded!");
  }
};