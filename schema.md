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

## Org-Users

* id
* name {first, last}
* tel
* permission (admin|editor|register|reporter)

## Consumer-Users

* id
* [name]
* national code
* location or region
* access way
* register date
* register by org-user->id
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
