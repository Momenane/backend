# schema

## Organization

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

* id
* name {first, last}
* national code
* email
* tel
* permission (admin|editor|register|reporter)

## Consumer-Users

* id
* [name](first and last)
* age (سن)
* sex (جنسیت)
* national code (کد ملی)
* location or region 
* وضعیت تأهل
* وضعیت مسکن
* سرپرست خانواده
* job شغل
* earning (درآمد)
* list of family member + age
* access way (tel, email)
* other org membership (شماره‌ی کمیته‌ی امداد، بهزیستی و ...)
* comment
* register date
* register by org-user->id (تأیید شده توسط)
* under support of organization(s)

## Org-Plan

* id
* name
* type
* notes/info
* donation (روش‌های کمک و مشارکت)
* total region/location/address
* amount/volume/goods
* [documentaion (مستندات)]

## Org-Plan-History

* id
* Con-User->id
* Org-Plan->id
* amount/volume/goods
* [date]
