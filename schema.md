# schema

## Organization

Known as `Group` in db.

* id
* name
* location
* address
* link(s)
  * site
  * tel
  * mail
  * social id
  * ...
* target region(s) (محدوده‌ی فعالیت)
* register number (شماره ثبت سازمانی)
* [logo]
* روش کمک

## Organization-Messages

* id
* Org-id
* message
* title
* status

## Org-Users

Known as `User` in db.

* id
* name {first, last}
* national code
* email
* tel
* permission (admin|editor|register|reporter)

## Indigent-Users

Known as `GroupMember` in db.

* id
* [name](first and last)
* age (سن)
* sex (جنسیت)
* national code (کد ملی)
* location or region
* marital status وضعیت تأهل
* have house وضعیت مسکن
* Households سرپرست خانواده
* job شغل
* monthly salary (درآمد)
* list of family member + age
* access way (tel, email)
* other org membership (شماره‌ی کمیته‌ی امداد، بهزیستی و ...)
* comment
* register date
* register by org-user->id (تأیید شده توسط)
* under support of organization(s)

## Org-Plan

Known as `GroupPlan` in db.

* id
* name
* type
* notes/info
* donation (روش‌های کمک و مشارکت)
* total region/location/address
* amount/volume/goods
* [documentaion (مستندات)]

## Org-Plan-History

Known as `DonateHistory` in db.

* id
* Con-User->id
* Org-Plan->id
* amount/volume/goods
* [date]
