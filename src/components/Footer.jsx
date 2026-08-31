"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";
import { fetchFullCatalog } from "@/lib/data-fetcher";

export default function Footer() {
  const [contactInfo, setContactInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [districtData, setDistrictData] = useState(null);
  const [categories, setCategories] = useState([]);

  const pathname = usePathname();

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

  const staticRoutes = [
    "about",
    "services",
    "products",
    "contact",
    "items",
  ];

  const district =
    pathParts.length > 0 &&
      !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  /* =========================================================
     LOAD CONTACT DATA
  ========================================================= */

  useEffect(() => {
    const loadContact = async () => {
      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "haemoglobinmetercom",
            "pages",
            "contact"
          )
        );

        if (snap.exists()) {
          setContactInfo(
            snap.data().contactInfo || []
          );
        }

        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    loadContact();
  }, []);

  /* =========================================================
     LOAD DISTRICT
  ========================================================= */

  useEffect(() => {
    const loadDistrict = async () => {
      if (!district) return;

      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "haemoglobinmetercom",
            "districts",
            district
          )
        );

        if (snap.exists()) {
          setDistrictData(snap.data());
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadDistrict();
  }, [district]);

  /* =========================================================
     LOAD CATEGORIES
  ========================================================= */

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catalog =
          await fetchFullCatalog();

        const uniqueCategories =
          Array.from(
            new Set(
              catalog
                .map(
                  (item) => item.category
                )
                .filter(Boolean)
            )
          );

        setCategories(
          uniqueCategories.slice(0, 7)
        );
      } catch (err) {
        console.error(
          "Error loading categories in footer:",
          err
        );
      }
    };

    loadCategories();
  }, []);

  /* =========================================================
     CONTACT VALUES
  ========================================================= */

  const getContactValue = (labelKeys, fallback = "") => {
    const found = contactInfo.find((x) =>
      labelKeys.some((k) => x.label?.toLowerCase() === k.toLowerCase())
    );
    return found && found.value !== null && found.value !== undefined
      ? String(found.value)
      : fallback;
  };

  const phone = getContactValue(
    ["phone", "direct mobile", "mobile", "contact"],
    "+91 9983123469\n+91 9983333489"
  );

  const email = getContactValue(
    ["email", "official email", "mail"],
    "rajbiosis@yahoo.in"
  );

  const address = getContactValue(
    ["address", "office address", "location"],
    "F-4, 1st Floor, Plot No. 16, D-Block Tagor Nagar, on Ajmer-Delhi, 200 Feet Bypass Rd, Jaipur, Rajasthan 302021"
  );

  const dynamicAddress =
    districtData
      ? `${districtData.district}, ${districtData.state}, India`
      : address;

  const phoneNumbers = phone
    ? phone
      .split(/[\n,]+/)
      .map((num) => num.trim())
      .filter(Boolean)
    : [];

  /* =========================================================
     DISTRICT LINK
  ========================================================= */

  const makeLink = (path) => {
    if (!district) return path;

    if (path === "/") {
      return `/${district}`;
    }

    return `/${district}${path}`;
  };

  /* =========================================================
     LOADING STATE
  ========================================================= */

  if (loading) {
    return (
      <footer className="bg-white border-t border-sky-100">

        <div className="container-custom py-16">

          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-10">

            {[...Array(4)].map((_, i) => (
              <div key={i}>

                <div className="h-8 w-40 bg-sky-100 rounded animate-pulse mb-6" />

                {[...Array(5)].map((_, j) => (
                  <div
                    key={j}
                    className="h-5 bg-slate-100 rounded animate-pulse mb-4"
                  />
                ))}

              </div>
            ))}

          </div>

          <div className="border-t border-sky-100 mt-12 pt-6">

            <div className="h-5 w-72 bg-slate-100 rounded animate-pulse" />

          </div>

        </div>

      </footer>
    );
  }

  /* =========================================================
     FOOTER
  ========================================================= */

  return (
    <footer className="bg-sky-50 border-t border-sky-100">

      <div className="container-custom py-16">

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-10">

          {/* =================================================
              BRAND
          ================================================= */}

          <div>

            <h2 className="text-2xl font-bold text-sky-700">

              Raj

              <span className="text-slate-800">
                {" "}Biosis
              </span>

            </h2>

            <p className="mt-5 text-slate-600 leading-7">

              Distributor of clinical-grade haemoglobin meters and automated diagnostics. Supporting hospital laboratories with high-accuracy instrumentation and technical services.

            </p>

            {/* Social Icons */}

            <div className="flex gap-4 mt-6">

              <a
                href="https://www.facebook.com/rajbiosispvtltd/"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-white
                  border
                  border-sky-100
                  flex
                  items-center
                  justify-center
                  text-sky-700
                  hover:bg-sky-700
                  hover:text-white
                  hover:border-sky-700
                  transition
                  shadow-sm
                "
              >
                <FaFacebookF size={18} />
              </a>

              <a
                href="https://www.instagram.com/rajbiosisindia/"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-white
                  border
                  border-sky-100
                  flex
                  items-center
                  justify-center
                  text-sky-700
                  hover:bg-sky-700
                  hover:text-white
                  hover:border-sky-700
                  transition
                  shadow-sm
                "
              >
                <FaInstagram size={18} />
              </a>

            </div>

          </div>

          {/* =================================================
              QUICK LINKS
          ================================================= */}

          <div className="w-fit">

            <h3 className="text-lg font-semibold mb-5 text-slate-800">
              Quick Links
            </h3>

            <div className="flex w-fit flex-col gap-3 text-slate-600">

              <Link
                href={makeLink("/")}
                className="hover:text-sky-700 transition"
              >
                Home
              </Link>

              <Link
                href={makeLink("/about")}
                className="hover:text-sky-700 transition"
              >
                About
              </Link>

              <Link
                href={makeLink("/services")}
                className="hover:text-sky-700 transition"
              >
                Services
              </Link>

              <Link
                href={makeLink("/items")}
                className="hover:text-sky-700 transition"
              >
                Products
              </Link>

              <Link
                href={makeLink("/contact")}
                className="hover:text-sky-700 transition"
              >
                Contact
              </Link>

            </div>

          </div>

          {/* =================================================
              CATEGORIES
          ================================================= */}

          <div className="w-fit">

            <h3 className="text-lg font-semibold mb-5 text-slate-800">
              Our Categories
            </h3>

            <div className="flex w-fit flex-col gap-3 text-slate-600">

              {categories.map((cat) => (

                <Link
                  key={cat}
                  href={makeLink(
                    `/items#${cat
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`
                  )}
                  className="
                    w-fit
                    hover:text-sky-700
                    transition
                    text-left
                  "
                >
                  {cat}
                </Link>

              ))}

              {categories.length === 0 && (
                <>
                  <p>Diagnostic Equipment</p>
                  <p>Laboratory Solutions</p>
                  <p>Biomedical Instruments</p>
                  <p>Maintenance Support</p>
                </>
              )}

            </div>

          </div>

          {/* =================================================
              CONTACT
          ================================================= */}

          <div>

            <h3 className="text-lg font-semibold mb-5 text-slate-800">
              Contact Info
            </h3>

            <div className="space-y-4 text-slate-600">

              {/* Address */}

              <div className="flex items-start gap-4">

                <div
                  className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-white
                    border
                    border-sky-100
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                  "
                >

                  <MapPin
                    size={24}
                    className="text-sky-700"
                  />

                </div>

                <p className="leading-7 pt-2">
                  {dynamicAddress}
                </p>

              </div>

              {/* Phone */}

              <div className="flex flex-col gap-2">

                {phoneNumbers.map(
                  (num, i) => (

                    <div
                      key={i}
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >

                      <Phone
                        size={18}
                        className="
                          text-sky-700
                          flex-shrink-0
                        "
                      />

                      <a
                        href={`tel:${num}`}
                        className="
                          hover:text-sky-700
                          transition
                        "
                      >
                        {num}
                      </a>

                    </div>

                  )
                )}

              </div>

              {/* Email */}

              <div className="flex items-center gap-3">

                <Mail
                  size={18}
                  className="text-sky-700"
                />

                <p>

                  <a
                    href={`mailto:${email}`}
                    className="
                      hover:text-sky-700
                      transition
                    "
                  >
                    {email}
                  </a>

                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            BOTTOM
        ================================================= */}

        <div
          className="
            border-t
            border-sky-100
            mt-12
            pt-6
            flex
            flex-col
            md:flex-row
            justify-between
            items-center
            text-sm
            text-slate-600
          "
        >

          <p>
            © 2026 Raj Biosis.
            All rights reserved.
          </p>

          <p className="mt-3 md:mt-0">
            Designed with precision for
            modern diagnostics.
          </p>

        </div>

      </div>

    </footer>
  );
}