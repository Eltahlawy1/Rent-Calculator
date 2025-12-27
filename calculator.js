// Egyptian Rent Calculator
// Handles both residential and commercial rent calculations according to Egyptian law

// Navigation Functions
function showSection(section, event) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.add('d-none');
    });

    // Show selected section
    document.getElementById(section + '-section').classList.remove('d-none');

    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    if (event && event.target) {
        event.target.classList.add('active');
    }
}

// Residential Rent Calculator
function calculateResidentialRent() {
    const form = document.getElementById('residential-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Show loading state
    const button = document.querySelector('#residential-form button[type="submit"]');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>جاري الحساب...';
    button.disabled = true;

    setTimeout(() => {
        const rent = parseFloat(document.getElementById('residential-rent').value);
        const category = document.getElementById('residential-category').value;
        const contractDate = new Date(document.getElementById('residential-date').value);
        const notes = document.getElementById('residential-notes').value;

        // Validate minimum rent based on category
        let minRent, multiplier, categoryName;

        switch (category) {
            case 'economic':
                minRent = 250;
                multiplier = 10;
                categoryName = 'الفئة الاقتصادية';
                break;
            case 'medium':
                minRent = 400;
                multiplier = 10;
                categoryName = 'الفئة المتوسطة';
                break;
            case 'premium':
                minRent = 1000;
                multiplier = 20;
                categoryName = 'الفئة المتميزة';
                break;
        }

        // Apply minimum rent if applicable
        let baseRent = Math.max(rent * multiplier, minRent);

        // Apply annual increases starting from September 1, 2026
        let currentRent = baseRent;
        const currentDate = new Date();

        // Apply 15% annual increases starting from September 1, 2026
        if (currentDate >= new Date('2026-09-01')) {
            for (let year = 2026; year <= currentDate.getFullYear(); year++) {
                currentRent *= 1.15;
            }
        }

        const results = {
            originalRent: rent,
            category: categoryName,
            baseRent: baseRent,
            currentRent: Math.round(currentRent),
            multiplier: multiplier,
            minRent: minRent,
            notes: notes
        };

        displayResidentialResults(results);

        // Restore button state
        button.innerHTML = originalText;
        button.disabled = false;
    }, 500);
}

// Commercial Rent Calculator
function calculateCommercialRent() {
    const form = document.getElementById('commercial-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Show loading state
    const button = document.querySelector('#commercial-form button[type="submit"]');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>جاري الحساب...';
    button.disabled = true;

    setTimeout(() => {
        const originalRent = parseFloat(document.getElementById('commercial-rent').value);
        const constructionPeriod = document.getElementById('construction-date').value;
        const contractDate = new Date(document.getElementById('contract-date').value);
        const notes = document.getElementById('commercial-notes').value;
        const currentDate = new Date();

        let currentRent = originalRent;
        const increaseHistory = [];

        // Law 6 of 1997 - Apply multiplier based on construction date
        if (contractDate < new Date('1997-03-26')) {
            let multiplier1997;
            let multiplierNote;

            switch (constructionPeriod) {
                case 'before-1944':
                    multiplier1997 = 8;
                    multiplierNote = 'ثمانية أمثال الأجرة - أماكن منشأة قبل 1/1/1944';
                    break;
                case '1944-1961':
                    multiplier1997 = 5;
                    multiplierNote = 'خمسة أمثال الأجرة - أماكن منشأة من 1/1/1944 إلى 4/11/1961';
                    break;
                case '1961-1973':
                    multiplier1997 = 4;
                    multiplierNote = 'أربعة أمثال الأجرة - أماكن منشأة من 5/11/1961 إلى 6/10/1973';
                    break;
                case '1973-1977':
                    multiplier1997 = 3;
                    multiplierNote = 'ثلاثة أمثال الأجرة - أماكن منشأة من 7/10/1973 إلى 9/9/1977';
                    break;
                case 'after-1977':
                    multiplier1997 = 1.1;  // ✅ تغيير من 1 إلى 1.1 (زيادة 10%)
                    multiplierNote = 'زيادة 10% - أماكن منشأة من 10/9/1977 إلى 30/1/1996';
                    break;
            }

            // Apply multiplier for all construction periods
            const beforeMultiplier = currentRent;
            currentRent *= multiplier1997;

            increaseHistory.push({
                year: '1997',
                beforeIncrease: beforeMultiplier.toFixed(2),  // ✅ بدون تقريب
                increasePercent: (multiplier1997 * 100).toFixed(0) + '%',
                afterIncrease: currentRent.toFixed(2),  // ✅ بدون تقريب
                notes: multiplierNote + ' - 26 مارس 1997 (قانون 6 لسنة 1997)'
            });

            // ✅ تطبيق زيادة 10% سنوياً لمدة 3 سنوات (1998-2000) للجميع
            for (let year = 1998; year <= 2000; year++) {
                const beforeAnnual = currentRent;
                currentRent *= 1.10;

                increaseHistory.push({
                    year: year.toString(),
                    beforeIncrease: beforeAnnual.toFixed(2),  // ✅ بدون تقريب
                    increasePercent: '10%',
                    afterIncrease: currentRent.toFixed(2),  // ✅ بدون تقريب
                    notes: `زيادة سنوية 10% - 26 مارس ${year} (قانون 6 لسنة 1997)`
                });
            }
        }

        // Law 14 of 2001 (apply current annual increases)
        let annualIncrease;
        let note2001;
        switch (constructionPeriod) {
            case 'before-1944':
            case '1944-1961':
            case '1961-1973':
            case '1973-1977':
                annualIncrease = 0.02;
                note2001 = 'زيادة سنوية 2% طبقاً للقانون 14 لسنة 2001';
                break;
            case 'after-1977':
                annualIncrease = 0.01;
                note2001 = 'زيادة سنوية 1% طبقاً للقانون 14 لسنة 2001';
                break;
        }

        // Calculate years since 2001
        if (currentDate >= new Date('2001-01-01')) {
            // Calculate until 2024 only (2025 will be handled separately)
            for (let year = 2001; year <= 2024; year++) {  // ✅ يتوقف عند 2024
                const beforeAnnual = currentRent;
                currentRent *= (1 + annualIncrease);

                increaseHistory.push({
                    year: year.toString(),
                    beforeIncrease: beforeAnnual.toFixed(2),  // ✅ بدون تقريب، فقط عرض رقمين
                    increasePercent: (annualIncrease * 100).toFixed(1) + '%',
                    afterIncrease: currentRent.toFixed(2),  // ✅ بدون تقريب
                    notes: note2001 + ' - سنة ' + year
                });
            }
        }

        // New law changes - Law 164 of 2025
        // Apply same annual increase in April 2025 (1% or 2% based on construction period)
        if (currentDate >= new Date('2025-04-01')) {
            // Apply annual increase in April 2025 (before the 5x increase)
            const before2025Increase = currentRent;
            currentRent *= (1 + annualIncrease);  // ✅ يستخدم المتغير (1% أو 2%)

            increaseHistory.push({
                year: 'أبريل 2025',
                beforeIncrease: before2025Increase.toFixed(2),
                increasePercent: (annualIncrease * 100).toFixed(1) + '%',
                afterIncrease: currentRent.toFixed(2),
                notes: note2001 + ' - سنة 2025'  // ✅ نفس صيغة السنوات السابقة
            });
        }

        // Then apply 5x increase from 1/9/2025
        if (currentDate >= new Date('2025-09-01')) {
            const before2025 = currentRent;
            currentRent *= 5;

            increaseHistory.push({
                year: 'سبتمبر 2025',  // ✅ تغيير الاسم
                beforeIncrease: before2025.toFixed(2),  // ✅ بدون تقريب
                increasePercent: 'خماسية (×5)',  // ✅ أوضح من 400% أو 500%
                afterIncrease: currentRent.toFixed(2),  // ✅ بدون تقريب
                notes: 'زيادة خماسية - 1 سبتمبر 2025 (قانون 164 لسنة 2025)'
            });

            // Apply 15% annually for 5 years starting from 1/9/2026
            if (currentDate >= new Date('2026-09-01')) {
                for (let year = 2026; year <= 2030; year++) {
                    const beforeAnnual = currentRent;
                    currentRent *= 1.15;

                    increaseHistory.push({
                        year: year.toString(),
                        beforeIncrease: beforeAnnual.toFixed(2),
                        increasePercent: '15%',
                        afterIncrease: currentRent.toFixed(2),
                        notes: `زيادة سنوية 15% - 1 سبتمبر ${year} (قانون 164 لسنة 2025)`
                    });
                }
            }
        }  // ✅ نهاية if (currentDate >= new Date('2025-09-01'))

        const results = {
            originalRent: originalRent,
            currentRent: Math.round(currentRent),
            constructionPeriod: getConstructionPeriodName(constructionPeriod),
            increaseHistory: increaseHistory,
            notes: notes
        };

        displayCommercialResults(results);

        // Restore button state
        button.innerHTML = originalText;
        button.disabled = false;
    }, 500);  // ✅ نهاية setTimeout
}  // ✅ نهاية function calculateCommercialRent()

// Helper Functions
function getConstructionPeriodName(period) {
    const names = {
        'before-1944': 'قبل 1/1/1944',
        '1944-1961': 'من 1/1/1944 إلى 4/11/1961',
        '1961-1973': 'من 5/11/1961 إلى 6/10/1973',
        '1973-1977': 'من 7/10/1973 إلى 9/9/1977',
        'after-1977': 'من 10/9/1977 إلى 30/1/1996'
    };
    return names[period];
}

function displayResidentialResults(results) {
    const resultDiv = document.getElementById('residential-result');
    const contentDiv = document.getElementById('residential-result-content');

    contentDiv.innerHTML = `
        <div class="result-section">
            <h5 class="text-success mb-3">
                <i class="fas fa-calculator me-2"></i>
                نتائج حساب الإيجار السكني
            </h5>
            
            <div class="result-item">
                <strong>قيمة الإيجار الأصلية:</strong> ${results.originalRent.toLocaleString()} جنيه
            </div>
            <div class="result-item">
                <strong>الفئة:</strong> ${results.category}
            </div>
            <div class="result-item">
                <strong>معامل الزيادة:</strong> ${results.multiplier} أضعاف
            </div>
            <div class="result-item">
                <strong>الحد الأدنى للفئة:</strong> ${results.minRent.toLocaleString()} جنيه
            </div>
            <div class="result-item">
                <strong>الإيجار بعد تطبيق المعامل:</strong> ${(results.originalRent * results.multiplier).toLocaleString()} جنيه
            </div>
            <div class="result-item">
                <strong>الإيجار الأساسي (بعد تطبيق الحد الأدنى):</strong> ${results.baseRent.toLocaleString()} جنيه
            </div>
            <div class="result-item total">
                <i class="fas fa-money-bill-wave me-2"></i>
                <strong>الإيجار النهائي الشهري:</strong> ${results.currentRent.toLocaleString()} جنيه
            </div>
            ${results.notes ? `
            <div class="result-item">
                <strong>الملاحظات:</strong> ${results.notes}
            </div>
            ` : ''}
        </div>
    `;

    resultDiv.classList.remove('d-none');
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

function displayCommercialResults(results) {
    const resultDiv = document.getElementById('commercial-result');
    const contentDiv = document.getElementById('commercial-result-content');

    contentDiv.innerHTML = `
        <div class="result-section">
            <h5 class="text-warning mb-3">
                <i class="fas fa-calculator me-2"></i>
                نتائج حساب الإيجار التجاري
            </h5>
            
            <div class="result-item">
                <strong>قيمة الإيجار الأصلية:</strong> ${results.originalRent.toLocaleString()} جنيه
            </div>
            <div class="result-item">
                <strong>تاريخ إنشاء العقار:</strong> ${results.constructionPeriod}
            </div>
            <div class="result-item total">
                <i class="fas fa-money-bill-wave me-2"></i>
                <strong>الإيجار النهائي الشهري:</strong> ${results.currentRent.toLocaleString()} جنيه
            </div>
            ${results.notes ? `
            <div class="result-item">
                <strong>الملاحظات:</strong> ${results.notes}
            </div>
            ` : ''}
        </div>
        
        <div class="table-container mt-4">
            <h6 class="text-primary mb-3">
                <i class="fas fa-table me-2"></i>
                جدول الزيادات التفصيلي
            </h6>
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>السنة</th>
                            <th>القيمة قبل الزيادة</th>
                            <th>نسبة الزيادة</th>
                            <th>القيمة بعد الزيادة</th>
                            <th>الملاحظات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${generateCommercialIncreasesTable(results.increaseHistory)}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="alert alert-info mt-3">
            <h6><i class="fas fa-info-circle me-2"></i>ملاحظات هامة:</h6>
            <ul class="mb-0">
                <li>تم تطبيق قوانين 6 لسنة 1997، 14 لسنة 2001، و164 لسنة 2025</li>
                <li>قانون 6/1997: أول أجرة مستحقة بعد 26/3/1997 - أضعال حسب تاريخ الإنشاء، وزيادة 10% سنوياً لمدة 3 سنوات (1998-2000) تبدأ من 26 مارس</li>
                <li>قانون 14/2001: زيادة سنوية 1% أو 2% حسب تاريخ إنشاء العقار ابتداءً من 2001</li>
                <li>قانون 164/2025: زيادة 2% في أبريل 2025، زيادة خماسية في سبتمبر 2025، زيادة 15% سنوياً من سبتمبر 2026</li>
                <li>ينتهي عقد الإيجار بعد 5 سنوات من تاريخ الزيادة</li>
            </ul>
        </div>
    `;

    resultDiv.classList.remove('d-none');
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

function generateCommercialIncreasesTable(increaseHistory) {
    if (!increaseHistory || increaseHistory.length === 0) {
        return '<tr><td colspan="5" class="text-center">لا توجد زيادات لعرضها</td></tr>';
    }

    return increaseHistory.map(increase => {
        return `
            <tr>
                <td>${increase.year}</td>
                <td>${increase.beforeIncrease}</td>
                <td>${increase.increasePercent}</td>
                <td>${increase.afterIncrease}</td>
                <td><small>${increase.notes}</small></td>
            </tr>
        `;
    }).join('');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    // Residential form submission
    document.getElementById('residential-form').addEventListener('submit', function (e) {
        e.preventDefault();
        calculateResidentialRent();
    });

    // Commercial form submission
    document.getElementById('commercial-form').addEventListener('submit', function (e) {
        e.preventDefault();
        calculateCommercialRent();
    });

    // Set maximum dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('residential-date').max = '1996-01-30';
    document.getElementById('contract-date').max = '1996-01-30';
});
