export default function SeoContent({ city = "" }) {
    const location = city || "India";

    return (
        <section className="py-20 bg-white">
            <div className="container-custom">
                <h2 className="text-4xl font-bold text-slate-900 mb-8">
                    Biomedical Haemoglobinometer & Laboratory Analyzer Supplier in {location}
                </h2>
                <div className="space-y-6 text-slate-600 leading-8 text-lg">
                    <p>
                        Raj Biosis is a premier supplier of clinical haemoglobin meters, automated hematology analyzers, 
                        and point-of-care (POC) blood diagnostic systems in {location}. We equip modern hospital 
                        departments, clinical laboratories, and blood banks with certified instrumentation for reliable 
                        hemoglobin measurement.
                    </p>
                    <p>
                        Our primary objective is to supply robust diagnostic machinery that improves laboratory test accuracy 
                        and speed. We partner with pathology clinics and healthcare centres across India, delivering 
                        high-performance biomedical systems.
                    </p>
                    <p>
                        We provide technical support, on-site installation guidance, and calibration assistance for our 
                        diagnostics range. Whether you are upgrading an existing laboratory setup or establishing a new 
                        testing centre, our specialists will help you select the ideal haemoglobinometer.
                    </p>
                    <p>
                        Raj Biosis distribution networks span numerous cities and districts, assisting medical teams 
                        in enhancing patient diagnostic outcomes.
                    </p>
                </div>

                <div className="mt-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-xl">
                                Are your haemoglobin meters certified for clinical use?
                            </h3>
                            <p className="text-slate-600 mt-2">
                                Yes, all haemoglobinometers and hematology analyzers we distribute comply with 
                                international clinical quality and safety certification standards.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-xl">
                                Do you ship laboratory blood analyzers across India?
                            </h3>
                            <p className="text-slate-600 mt-2">
                                Yes, we ship and distribute clinical diagnostic equipment to multiple states, districts, 
                                and municipalities nationwide.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-xl">
                                What support do you provide post-purchase?
                            </h3>
                            <p className="text-slate-600 mt-2">
                                We offer full installation support, operational training, calibration assistance, 
                                and annual maintenance contracts (AMC/CMC) for all our devices.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-xl">
                                Who can purchase biomedical equipment?
                            </h3>
                            <p className="text-slate-600 mt-2">
                                Hospitals, pathology labs, diagnostic centres, research laboratories and healthcare facilities 
                                can purchase equipment from us.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
