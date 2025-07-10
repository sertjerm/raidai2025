SELECT DISTINCT 
                  m.mb_code, m.fullname, m.dept_code, m.dept_name, m.sect_code, m.sect_name, m.mb_money, m.mb_salary, v.INVC_AIDAMNT, v.TOTAL1 - v.INVC_AIDAMNT AS TOTAL1, v.TOTAL2, v.LASTUPDATE, v.NOTE, p.PeriodName, p.PeriodID, 
                  c.ConfirmStatus
FROM     dbo.v_raidai2019 AS m INNER JOIN
                  dbo.kusc_invc AS v ON m.mb_code = v.INVC_CODE INNER JOIN
                  dbo.kusc_raidai_period AS p ON CAST(p.PeriodDate AS DATE) = v.INVC_DATE AND p.PeriodStatus = 1 INNER JOIN
                  dbo.user_map_deptsect AS u ON m.dept_code + m.sect_code = u.dept_code + u.sect_code LEFT OUTER JOIN
                  dbo.kusc_raidai_confirm AS c ON m.dept_code + m.sect_code = c.DeptCode + c.SectCode AND p.PeriodID = c.PeriodID